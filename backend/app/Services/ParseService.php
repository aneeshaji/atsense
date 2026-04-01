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
        $pdfPath = $file->getPathname();

        // 1. Try pdftotext (Poppler) for best spacing/layout preservation
        try {
            $popplerBin = 'pdftotext';
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                $winBin = base_path('../backend-node/node_modules/pdf-poppler/lib/win/poppler-0.51/bin/pdftotext.exe');
                if (file_exists($winBin)) {
                    $popplerBin = $winBin;
                }
            }

            $tempDir = storage_path('app/temp');
            if (!is_dir($tempDir)) {
                mkdir($tempDir, 0777, true);
            }

            $tempTxt = $tempDir . '/' . uniqid() . '.txt';
            $cmd = "\"{$popplerBin}\" -layout " . escapeshellarg($pdfPath) . " " . escapeshellarg($tempTxt);
            exec($cmd, $output, $returnVar);

            if ($returnVar === 0 && file_exists($tempTxt)) {
                $text = file_get_contents($tempTxt);
                unlink($tempTxt);
            }
        } catch (\Exception $e) {
            // pdftotext failed
        }

        // 2. Fallback to Smalot PdfParser if pdftotext produced nothing
        if (empty(trim($text))) {
            try {
                $parser = new Parser();
                $pdf = $parser->parseFile($pdfPath);
                $text = $pdf->getText();
            } catch (\Exception $e) {
                // Parser failed
            }
        }

        // 3. Clean up whitespace but preserve layout-aware spacing
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

        // 4. Final Fallback to OCR if still too little text
        if (strlen($text) < 50) {
            try {
                $text = $this->extractTextViaOCR($file);
            } catch (\Exception $e) {
                throw new \Exception('Failed to parse PDF via all methods: ' . $e->getMessage());
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
