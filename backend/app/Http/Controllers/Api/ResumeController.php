<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ParseService;
use App\Services\AIService;
use Illuminate\Support\Facades\Log;

class ResumeController extends Controller
{
    /**
     * Stateless offline import from file (PDF/DOCX)
     */
    public function importOffline(Request $request)
    {
        if (!$request->hasFile('resume')) {
            Log::warning('Import attempt without file');
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        try {
            $file = $request->file('resume');
            Log::info('Importing file: ' . $file->getClientOriginalName() . ' (' . $file->getMimeType() . ')');
            
            // 1. Extract Text
            $parseService = new ParseService();
            $text = $parseService->extractText($file);
            Log::info('Text extraction complete. Length: ' . strlen($text));

            // Sanitize text
            if (!empty($text)) {
                $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
            }

            if (empty($text) || strlen($text) < 20) {
                 Log::error('Extraction produced too little text');
                 return response()->json([
                    'message' => 'Could not read resume content',
                    'error' => 'The file might be empty, password-protected, or unsupported.'
                ], 422);
            }

            // 2. Parse with AI
            $aiService = app(AIService::class);
            Log::info('Connecting to AI for parsing...');
            $parsedData = $aiService->parseResumeJSON($text);
            
            if (!$parsedData) {
                Log::error('AI Parsing returned null');
                throw new \Exception('AI failed to interpret the resume data structure.');
            }

            // 3. Map to dynamic Resume object
            $resume = [
                'title' => 'Imported Resume',
                'personalInfo' => $userProvidedInfo = [
                    'fullName' => $parsedData['personalInfo']['fullName'] ?? '',
                    'email' => $parsedData['personalInfo']['email'] ?? '',
                    'phone' => $parsedData['personalInfo']['phone'] ?? '',
                    'location' => $parsedData['personalInfo']['location'] ?? '',
                    'linkedin' => $parsedData['personalInfo']['linkedin'] ?? '',
                    'github' => $parsedData['personalInfo']['github'] ?? '',
                    'portfolio' => $parsedData['personalInfo']['portfolio'] ?? '',
                ],
                'summary' => $parsedData['summary'] ?? '',
                'skills' => $parsedData['skills'] ?? [],
                'experience' => $parsedData['experience'] ?? [],
                'education' => $parsedData['education'] ?? [],
                'certifications' => $parsedData['certifications'] ?? [],
                'projects' => $parsedData['projects'] ?? [],
                'languages' => $parsedData['languages'] ?? [],
                'atsScore' => 0,
            ];

            Log::info('Import successful for: ' . ($resume['personalInfo']['fullName'] ?: 'Unknown User'));
            return response()->json($resume, 200);

        } catch (\Exception $e) {
            Log::error('IMPORT CRASH: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Critical Import Error',
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName() ?? 'unknown'
            ], 500);
        }
    }

    /**
     * Stateless ATS Breakdown
     */
    public function analyzeBreakdownOffline(Request $request)
    {
        // Handle both 'resume' and 'resume_text' from frontend
        $resumeDataRaw = $request->input('resume_text') ?? $request->input('resume');
        
        // Handle JSON string if provided
        $resume = is_string($resumeDataRaw) ? json_decode($resumeDataRaw, true) : $resumeDataRaw;

        if (!$resume) {
            return response()->json(['message' => 'No resume data provided'], 400);
        }

        try {
            $aiService = app(AIService::class);
            
            // Prepare resume data for analysis
            $analysisData = [
                'role' => $resume['title'] ?? '',
                'skills' => $resume['skills'] ?? [],
                'experience' => $resume['experience'] ?? [],
                'education' => $resume['education'] ?? [],
            ];

            $analysis = $aiService->analyzeATSBreakdown($analysisData);

            // Add 'score' alias for frontend compatibility
            if (isset($analysis['overallScore'])) {
                $analysis['score'] = $analysis['overallScore'];
            }

            return response()->json($analysis);

        } catch (\Exception $e) {
            Log::error('ATS Analysis Failed: ' . $e->getMessage());
            // Fallback if AI fails
            return response()->json([
                'overallScore' => $resume['atsScore'] ?? 0,
                'breakdown' => [], 
                'missingKeywords' => [],
                'matchedKeywords' => [],
                'issues' => ['AI Analysis failed Temporarily: ' . $e->getMessage()],
                'recommendations' => ['Try again later']
            ]);
        }
    }
}
