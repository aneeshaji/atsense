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
            // Parser failed, might be malformed or encrypted. Continue to OCR.
        }

        // If extraction failed or yielded too little text (likely image-based), use OCR
        if (strlen($text) < 50) {
            try {
                // Use Facade or instantiation. Since we are in Service, instantiation is fine or app() helper.
                $aiService = app(\App\Services\AIService::class);
                $ocrText = $aiService->extractTextWithGemini(
                    file_get_contents($file->getPathname()), 
                    'application/pdf'
                );
                
                if (!empty($ocrText)) {
                    return trim($ocrText);
                }
            } catch (\Exception $e) {
                // OCR failed too
                throw new \Exception('Failed to parse PDF via Standard Parser and OCR Fallback: ' . $e->getMessage());
            }
        }
        
        return $text;
    }
}
