<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resume;

class CoverLetterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->coverLetters);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Limit check
        $count = $request->user()->coverLetters()->count();
        if ($count >= 3) {
            return response()->json([
                'message' => 'Cover letter limit reached',
                'error' => 'You can only generate up to 3 cover letters in the free plan.'
            ], 403);
        }

        // Support both camelCase (frontend) and snake_case (fallback)
        $request->validate([
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
        $companyName = $request->companyName ?? $request->company_name ?? '';

        // Get Resume
        $resume = $request->user()->resumes()->find($resumeId);
        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        // Generate Content using AI Service
        try {
            $aiService = app(\App\Services\AIService::class);
            $content = $aiService->generateCoverLetter(
                $resume, 
                $jobTitle, 
                $companyName, 
                $jobDesc
            );
        } catch (\Exception $e) {
             return response()->json(['message' => 'AI generation failed', 'error' => $e->getMessage()], 503);
        }

        $coverLetter = $request->user()->coverLetters()->create([
            'resume_id' => $resumeId,
            'job_title' => $jobTitle,
            'company_name' => $companyName,
            'job_description' => $jobDesc,
            'content' => $content
        ]);

        return response()->json($coverLetter, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $coverLetter = $request->user()->coverLetters()->find($id);

        if (!$coverLetter) {
            return response()->json(['message' => 'Cover letter not found'], 404);
        }

        return response()->json($coverLetter);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coverLetter = $request->user()->coverLetters()->find($id);

        if (!$coverLetter) {
            return response()->json(['message' => 'Cover letter not found'], 404);
        }

        $coverLetter->update($request->all());

        return response()->json($coverLetter);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $coverLetter = $request->user()->coverLetters()->find($id);

        if (!$coverLetter) {
            return response()->json(['message' => 'Cover letter not found'], 404);
        }

        $coverLetter->delete();

        return response()->json(['message' => 'Cover letter deleted']);
    }
}
