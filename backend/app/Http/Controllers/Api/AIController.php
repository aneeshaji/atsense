<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Generate AI Resume Content
     */
    public function generateResume(Request $request)
    {


        \Illuminate\Support\Facades\Log::info('Generate Resume Request:', $request->all());

        // Support both camelCase (frontend) and snake_case (fallback)
        $data = $request->validate([
            'resumeId' => 'required_without:resume_id|exists:resumes,id',
            'resume_id' => 'required_without:resumeId|exists:resumes,id',
            'jobTitle' => 'required_without:job_title|string',
            'job_title' => 'required_without:jobTitle|string',
            'jobDescription' => 'required_without:job_description|string',
            'job_description' => 'required_without:jobDescription|string',
        ]);

        // Normalize data
        $resumeId = $request->resumeId ?? $request->resume_id;
        $jobTitle = $request->jobTitle ?? $request->job_title;
        $jobDesc = $request->jobDescription ?? $request->job_description;

        $resume = $request->user()->resumes()->find($resumeId);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        try {
            $aiData = $this->aiService->generateResumeContent(
                $request->jobTitle,
                $request->jobDescription,
                $resume->experience
            );

            // Update resume with AI content
            $resume->summary = $aiData['summary'] ?? $resume->summary;
            $resume->skills = $aiData['skills'] ?? $resume->skills;

            // Merge experience logic could be complex, for now simple implementation:
            if (isset($aiData['experience']) && is_array($aiData['experience'])) {
                 $resume->experience = $this->mergeExperience($resume->experience, $aiData['experience']);
            }
            
            $resume->job_description = $request->jobDescription;
            $resume->save();

            return response()->json($resume);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Service connection failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Analyze Job Match (ATS Score)
     */
    public function analyzeJobMatch(Request $request)
    {
        $request->validate([
            'resumeId' => 'required|exists:resumes,id',
            'jobDescription' => 'required|string',
        ]);

        $resume = $request->user()->resumes()->find($request->resumeId);

        try {
            $analysis = $this->aiService->analyzeJobMatch($resume, $request->jobDescription);
            
            // Update score
            if (isset($analysis['score'])) {
                $resume->ats_score = $analysis['score'];
                $resume->save();
            }

            return response()->json($analysis);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Service connection failed', 
                'error' => $e->getMessage()
            ], 503);
        }
    }

    private function mergeExperience($original, $generated)
    {
        // Simple merge: replace responsibilities if titles match vaguely
        // In reality, might want more robust matching
        return $generated; 
    }

    /**
     * Optimize LinkedIn Profile
     */
    public function optimizeLinkedIn(Request $request)
    {
        $request->validate([
            'resumeId' => 'required|exists:resumes,id',
            'targetRole' => 'nullable|string',
        ]);

        $resume = $request->user()->resumes()->find($request->resumeId);

        try {
            $analysis = $this->aiService->optimizeLinkedInProfile($resume, $request->targetRole);
            return response()->json($analysis);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Service failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }
}
