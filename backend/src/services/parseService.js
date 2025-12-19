const PDFParser = require('pdf2json');
const mammoth = require('mammoth');

exports.extractText = async (file) => {
    try {
        if (file.mimetype === 'application/pdf') {
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();

                pdfParser.on('pdfParser_dataError', (errData) => {
                    reject(new Error(`PDF parsing failed: ${errData.parserError}`));
                });

                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    try {
                        // Extract text from all pages
                        let text = '';
                        if (pdfData.Pages) {
                            pdfData.Pages.forEach(page => {
                                if (page.Texts) {
                                    page.Texts.forEach(textItem => {
                                        if (textItem.R) {
                                            textItem.R.forEach(r => {
                                                if (r.T) {
                                                    try {
                                                        // Try to decode, fallback to raw text if it fails
                                                        text += decodeURIComponent(r.T) + ' ';
                                                    } catch (e) {
                                                        // If decoding fails, use the raw text
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
