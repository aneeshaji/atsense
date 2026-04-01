<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AIService;
use Illuminate\Support\Facades\Log;

class InterviewController extends Controller
{
    /**
     * Generate interview questions based on resume and JD
     */
    public function generateQuestions(Request $request)
    {
        $request->validate([
            'resume' => 'required|array',
            'jobDescription' => 'required|string',
        ]);

        try {
            $aiService = app(AIService::class);
            $questions = $aiService->generateInterviewQuestions(
                $request->input('resume'),
                $request->input('jobDescription')
            );

            return response()->json($questions);

        } catch (\Exception $e) {
            Log::error('Interview Question Generation Failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'AI Service failed to generate questions',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Evaluate a candidate's answer
     */
    public function evaluateAnswer(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'jobDescription' => 'required|string',
        ]);

        try {
            $aiService = app(AIService::class);
            $evaluation = $aiService->evaluateInterviewAnswer(
                $request->input('question'),
                $request->input('answer'),
                $request->input('jobDescription')
            );

            return response()->json($evaluation);

        } catch (\Exception $e) {
            Log::error('Interview Answer Evaluation Failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'AI Service failed to evaluate answer',
                'error' => $e->getMessage()
            ], 503);
        }
    }
}
