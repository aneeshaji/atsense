<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use Illuminate\Http\UploadedFile;

class ParseService
{
    public function extractText(UploadedFile $file)
    {
        $mimeType = $file->getMimeType();

        if ($mimeType === 'application/pdf') {
            return $this->extractTextFromPDF($file);
        }
        
        // TODO: Implement DOCX extraction
        // if ($mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        //     return $this->extractTextFromDOCX($file);
        // }

        throw new \Exception('Unsupported file type. Please upload a PDF.');
    }

    protected function extractTextFromPDF(UploadedFile $file)
    {
        $text = '';
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getPathname());
            $text = $pdf->getText();
            $text = preg_replace('/\s+/', ' ', $text);
            $text = trim($text);
        } catch (\Exception $e) {
            // Parser failed
        }

        // If extraction failed or yielded too little text, use OCR fallback
        if (strlen($text) < 50) {
            try {
                $text = $this->extractTextViaOCR($file);
            } catch (\Exception $e) {
                throw new \Exception('Failed to parse PDF via Standard Parser and OCR Fallback: ' . $e->getMessage());
            }
        }
        
        return $text;
    }

    protected function extractTextViaOCR(UploadedFile $file)
    {
        $tempDir = storage_path('app/temp/ocr_' . uniqid());
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $pdfPath = $file->getPathname();
        $outputPrefix = $tempDir . '/page';
        
        // Detect Poppler Path
        $popplerPath = 'pdftoppm'; // Default to system PATH
        
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $localWinPath = base_path('../backend-node/node_modules/pdf-poppler/lib/win/poppler-0.51/bin/pdftoppm.exe');
            if (file_exists($localWinPath)) {
                $popplerPath = $localWinPath;
            }
        }
        
        // Convert PDF to PNG images
        $pdfPathEscaped = escapeshellarg($pdfPath);
        $outputPrefixEscaped = escapeshellarg($outputPrefix);
        
        $cmd = "\"{$popplerPath}\" -png {$pdfPathEscaped} {$outputPrefixEscaped}";
        exec($cmd, $output, $returnVar);

        if ($returnVar !== 0) {
            throw new \Exception("pdftoppm failed with exit code {$returnVar}");
        }

        // Find all generated images
        $images = glob($tempDir . '/page-*.png');
        sort($images);

        if (empty($images)) {
            throw new \Exception("No images generated from PDF");
        }

        $aiService = app(\App\Services\AIService::class);
        $fullText = "";

        foreach ($images as $imagePath) {
            $imageData = base64_encode(file_get_contents($imagePath));
            $pageText = $aiService->extractTextWithGroqVision($imageData, 'image/png');
            $fullText .= $pageText . "\n\n";
        }

        // Cleanup
        foreach (glob($tempDir . '/*') as $f) unlink($f);
        rmdir($tempDir);

        return trim($fullText);
    }
}
