const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const { createWorker } = require('tesseract.js');
// Cross-platform PDF to Image libraries
let poppler;
if (process.platform === 'win32') {
    poppler = require('pdf-poppler');
} else {
    // node-poppler doesn't bundle binaries, requires system ones (installed in setup-ec2.sh)
    const { Poppler } = require('node-poppler');
    poppler = new Poppler();
}

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Extract text from text-based PDF using pdf2json
 */
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (errData) => {
            reject(new Error(`PDF parsing failed: ${errData.parserError}`));
        });

        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            try {
                let text = '';
                if (pdfData.Pages) {
                    pdfData.Pages.forEach(page => {
                        if (page.Texts) {
                            page.Texts.forEach(textItem => {
                                if (textItem.R) {
                                    textItem.R.forEach(r => {
                                        if (r.T) {
                                            try {
                                                text += decodeURIComponent(r.T) + ' ';
                                            } catch (e) {
                                                text += r.T.replace(/%20/g, ' ') + ' ';
                                            }
                                        }
                                    });
                                }
                            });
                            text += '\n';
                        }
                    });
                }
                resolve(text.trim());
            } catch (err) {
                reject(new Error(`Text extraction failed: ${err.message}`));
            }
        });

        pdfParser.parseBuffer(file.buffer);
    });
}

/**
 * Extract text from image-based PDF using OCR (Tesseract.js)
 */
async function extractTextWithOCR(fileBuffer) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-ocr-'));
    const pdfPath = path.join(tempDir, 'input.pdf');

    try {
        // Save PDF buffer to temp file
        await fs.writeFile(pdfPath, fileBuffer);

        const outputPrefix = path.join(tempDir, 'page');
        console.log(`OCR: Converting PDF to images in ${tempDir} (Platform: ${process.platform})...`);

        if (process.platform === 'win32') {
            const options = {
                format: 'png',
                out_dir: tempDir,
                out_prefix: 'page',
                page: null
            };
            await poppler.convert(pdfPath, options);
        } else {
            const options = {
                pngFile: true,
            };
            await poppler.pdfToCairo(pdfPath, outputPrefix, options);
        }

        // Find all generated PNG files
        const files = await fs.readdir(tempDir);
        console.log(`OCR: Files in temp dir: ${files.join(', ')}`);
        const pngFiles = files.filter(f => f.endsWith('.png')).sort();

        if (pngFiles.length === 0) {
            throw new Error('No images generated from PDF');
        }

        console.log(`OCR: Processing ${pngFiles.length} page(s)...`);

        // Initialize Tesseract worker
        const worker = await createWorker('eng');

        let fullText = '';

        // Process each page
        for (const pngFile of pngFiles) {
            const imagePath = path.join(tempDir, pngFile);
            const { data: { text } } = await worker.recognize(imagePath);
            fullText += text + '\n\n';
            console.log(`OCR: Processed ${pngFile}`);
        }

        await worker.terminate();

        return fullText.trim();

    } catch (error) {
        console.error('OCR Error Detail:', error);
        throw new Error(`OCR failed at step: ${error.message}`);
    } finally {
        // Cleanup temp files
        try {
            const files = await fs.readdir(tempDir);
            for (const file of files) {
                await fs.unlink(path.join(tempDir, file));
            }
            await fs.rmdir(tempDir);
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
    }
}

/**
 * Main export: Extract text from PDF or DOCX with OCR fallback
 */
exports.extractText = async (file) => {
    try {
        if (file.mimetype === 'application/pdf') {
            // Try text extraction first (fast)
            console.log(`PDF Parsing: Starting text extraction for ${file.originalname}...`);
            let text = await extractTextFromPDF(file);

            console.log(`PDF Parsing: Extracted ${text.length} characters of initial text via pdf2json.`);
            console.log(`PDF Parsing: Preview: "${text.substring(0, 100)}..."`);

            // If extracted text is too short, likely image-based PDF
            if (text.length < 500) { // Increased threshold further for safety
                console.log('⚠️  Minimal text extracted (< 500 chars). Triggering OCR fallback...');
                try {
                    const ocrText = await extractTextWithOCR(file.buffer);
                    console.log(`✅ OCR completed! Extracted ${ocrText.length} characters.`);
                    // Combine or replace? Usually OCR is much better for these cases
                    text = ocrText;
                } catch (ocrErr) {
                    console.error('❌ OCR Fallback Critical Failure:', ocrErr);
                }
            }

            return text;

        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            return result.value;
        } else {
            throw new Error(`Unsupported file type: ${file.mimetype}. Please upload PDF or DOCX.`);
        }
    } catch (error) {
        console.error('Text Extraction Error:', error.message);
        throw new Error(`Failed to parse file: ${error.message}`);
    }
};
