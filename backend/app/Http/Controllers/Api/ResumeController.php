<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->resumes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Limit check
        $count = $request->user()->resumes()->count();
        if ($count >= 3) {
            return response()->json([
                'message' => 'Resume limit reached',
                'error' => 'You can only have up to 3 resumes in the free plan.'
            ], 403);
        }

        $resume = $request->user()->resumes()->create($request->all());

        return response()->json($resume, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        return response()->json($resume);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        $resume->update($request->all());

        return response()->json($resume);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        $resume->delete();

        return response()->json(['message' => 'Resume deleted']);
    }

    /**
     * Import resume from file (PDF/DOCX)
     */
    public function importResume(Request $request)
    {
        // Limit check
        $count = $request->user()->resumes()->count();
        if ($count >= 3) {
            return response()->json([
                'message' => 'Resume limit reached',
                'error' => 'You can only have up to 3 resumes in the free plan.'
            ], 403);
        }

        if (!$request->hasFile('resume')) {
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        try {
            $file = $request->file('resume');
            
            // 1. Extract Text
            $parseService = new \App\Services\ParseService();
            $text = $parseService->extractText($file);

            if (empty($text) || strlen($text) < 50) {
                 return response()->json([
                    'message' => 'Could not extract text',
                    'error' => 'The PDF might be image-based. OCR is not yet supported.'
                ], 422);
            }

            // 2. Parse with AI
            $aiService = app(\App\Services\AIService::class);
            $parsedData = $aiService->parseResumeJSON($text);

            if (!$parsedData) {
                throw new \Exception('AI failed to parse resume data');
            }

            // 3. Create Resume
            $resume = $request->user()->resumes()->create([
                'title' => 'Imported Resume - ' . date('Y-m-d H:i'),
                'personal_info' => $parsedData['personalInfo'] ?? [],
                'summary' => $parsedData['summary'] ?? '',
                'skills' => $parsedData['skills'] ?? [],
                'experience' => $parsedData['experience'] ?? [],
                'education' => $parsedData['education'] ?? [],
                'ats_score' => 0,
                'job_description' => ''
            ]);

            return response()->json($resume, 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Import failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get ATS Breakdown
     */
    public function getATSBreakdown(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        // Use AI Service to calculate real score
        try {
            $aiService = app(\App\Services\AIService::class);
            
            // Prepare resume data for analysis
            $resumeData = [
                'role' => $resume->title,
                'skills' => $resume->skills,
                'experience' => $resume->experience,
                'education' => $resume->education,
            ];

            $analysis = $aiService->analyzeATSBreakdown($resumeData);

            // Update local score
            if (isset($analysis['overallScore'])) {
                $resume->ats_score = $analysis['overallScore'];
                $resume->save();
            }

            return response()->json($analysis);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('ATS Analysis Failed: ' . $e->getMessage());
            // Fallback if AI fails
            return response()->json([
                'overallScore' => $resume->ats_score,
                'breakdown' => [], 
                'missingKeywords' => [],
                'matchedKeywords' => [],
                'issues' => ['AI Analysis failed Temporarily'],
                'recommendations' => ['Try again later']
            ]);
        }
    }

    /**
     * Preview Resume HTML
     */
    public function preview(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        $html = view('pdf.resume', ['resume' => $resume])->render();
        
        return response($html, 200)
                  ->header('Content-Type', 'text/html');
    }
}
