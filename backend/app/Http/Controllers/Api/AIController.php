<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Stateless Optimize Resume
     */
    public function optimizeResumeOffline(Request $request)
    {
        // Support both snake_case and camelCase from frontend
        $jobTitle = $request->input('job_title') ?? $request->input('jobTitle');
        $jobDescription = $request->input('job_description') ?? $request->input('jobDescription');

        $request->validate([
            'resume' => 'required', // can be string or array
        ]);

        if (!$jobTitle || !$jobDescription) {
            return response()->json([
                'message' => 'The job title and description fields are required.',
                'errors' => [
                    'job_title' => ['The job title field is required.'],
                    'job_description' => ['The job description field is required.']
                ]
            ], 422);
        }

        $resumeRaw = $request->input('resume');
        $resume = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

        try {
            $aiData = $this->aiService->generateResumeContent(
                $jobTitle,
                $jobDescription,
                $resume['experience'] ?? []
            );

            // Update resume with AI content
            $resume['summary'] = $aiData['summary'] ?? ($resume['summary'] ?? '');
            $resume['skills'] = $aiData['skills'] ?? ($resume['skills'] ?? []);

            if (isset($aiData['experience']) && is_array($aiData['experience'])) {
                 $resume['experience'] = $aiData['experience'];
            }
            
            if (isset($aiData['latex_source'])) {
                $resume['latex_source'] = $aiData['latex_source'];
            }

            return response()->json(['optimized_resume' => $resume]);

        } catch (\Exception $e) {
            Log::error('AI Optimization Failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'AI Service failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Stateless Generate Professional Summary
     */
    public function generateSummaryOffline(Request $request)
    {
        $request->validate([
            'job_title' => 'required|string',
            'resume_context' => 'required', // can be string or array
        ]);

        $resumeRaw = $request->input('resume_context');
        $resume = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

        try {
            $summary = $this->aiService->generateProfessionalSummary(
                $request->input('job_title'),
                json_encode($resume)
            );

            return response()->json(['summary' => $summary]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Service failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Stateless Generate Cover Letter
     */
    public function generateCoverLetterOffline(Request $request)
    {
        // Support both snake_case and camelCase
        $jobTitle = $request->input('job_title') ?? $request->input('jobTitle');
        $jobDescription = $request->input('job_description') ?? $request->input('jobDescription');
        $companyName = $request->input('company_name') ?? $request->input('companyName');

        $request->validate([
            'resume' => 'required', // string or array
        ]);

        if (!$jobTitle || !$jobDescription) {
            return response()->json([
                'message' => 'The job title and description fields are required.',
                'errors' => [
                    'job_title' => ['The job title field is required.'],
                    'job_description' => ['The job description field is required.']
                ]
            ], 422);
        }

        $resumeRaw = $request->input('resume');
        $resume = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

        try {
            $content = $this->aiService->generateCoverLetter(
                (object)$resume, 
                $jobTitle, 
                $companyName ?? '', 
                $jobDescription
            );

            return response()->json(['content' => $content]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Service connection failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Stateless LinkedIn Optimization
     */
    public function optimizeLinkedInOffline(Request $request)
    {
        // Support both snake_case and camelCase
        $targetRole = $request->input('target_role') ?? $request->input('targetRole');

        $request->validate([
            'resume' => 'nullable', // string or array
        ]);

        try {
            $resumeRaw = $request->input('resume');
            $resume = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;
            
            if (!$resume) {
                return response()->json(['message' => 'No resume data provided'], 400);
            }

            $result = $this->aiService->optimizeLinkedInProfile(
                $resume,
                $targetRole
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'LinkedIn AI Service failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Stateless Job Matcher
     */
    public function matchResumeOffline(Request $request)
    {
        // Support both snake_case and camelCase
        $jobDescription = $request->input('job_description') ?? $request->input('jobDescription');

        $request->validate([
            'resume' => 'required', // string or array
        ]);

        if (!$jobDescription) {
            return response()->json([
                'message' => 'The job description field is required.',
                'errors' => ['job_description' => ['The job description field is required.']]
            ], 422);
        }

        try {
            $resumeRaw = $request->input('resume');
            $resume = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

            $result = $this->aiService->analyzeJobMatch(
                (object)$resume, 
                $jobDescription
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Match Analysis failed',
                'error' => $e->getMessage()
            ], 503);
        }
    }
}
