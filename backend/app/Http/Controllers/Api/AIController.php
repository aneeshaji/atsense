<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use App\Models\ResumeLead;
use App\Models\Resume;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

            // ── Silent lead update after optimization ──────────────────────────
            try {
                $email = $resume['personalInfo']['email'] ?? null;
                if ($email) {
                    ResumeLead::updateOrCreate(
                        ['email' => $email],
                        [
                            'source'          => 'optimized',
                            'job_title'       => $jobTitle,
                            'job_description' => $jobDescription,
                            'skills'          => json_encode($resume['skills'] ?? []),
                            'resume_data'     => json_encode($resume),
                        ]
                    );
                }
            } catch (\Exception $leadEx) {
                Log::warning('Lead update after optimize failed: ' . $leadEx->getMessage());
            }
            // ── Overwrite Resume in DB Database storage ────────────────────
            try {
                if (!empty($resume['id'])) {
                    $existing = Resume::find($resume['id']);
                    if ($existing) {
                        $existing->update([
                            'title'           => "Optimized for " . $jobTitle,
                            'summary'         => $resume['summary'] ?? '',
                            'skills'          => $resume['skills'] ?? [],
                            'experience'      => $resume['experience'] ?? [],
                            'education'       => $resume['education'] ?? [],
                            'job_description' => $jobDescription,
                            'personal_info'   => $resume['personalInfo'] ?? [],
                        ]);
                        $resume['title'] = "Optimized for " . $jobTitle;
                    }
                }
            } catch (\Exception $resumeEx) {
                Log::warning('Resume DB update after optimize failed: ' . $resumeEx->getMessage());
            }

            // ── Generate and Replace PDF in storage ────────────────────────────────
            try {
                $email = $resume['personalInfo']['email'] ?? null;
                $name  = $resume['personalInfo']['fullName'] ?? 'user';
                
                if ($email || $name) {
                    // Generate PDF from optimized data
                    $options = new Options();
                    $options->set('isRemoteEnabled', true);
                    $options->set('defaultFont', 'Helvetica');
    
                    $dompdf = new Dompdf($options);
                    $html = view('pdf.resume', ['resume' => (object)$resume])->render();
                    $dompdf->loadHtml($html);
                    $dompdf->setPaper('A4', 'portrait');
                    $dompdf->render();
                    $pdfOutput = $dompdf->output();
    
                    // Upload to S3
                    $dateDir  = date('Y-m-d');
                    $safeName = Str::slug($name);
                    $fileName = "resumes/{$dateDir}/optimized_{$safeName}_" . time() . ".pdf";
                    
                    $disk = \Illuminate\Support\Facades\Storage::disk('s3');
                    $disk->put($fileName, $pdfOutput, 'public');
                    $publicUrl = $disk->url($fileName);
    
                    // Update Lead with the optimized file URL
                    if ($email) {
                        ResumeLead::where('email', $email)->update([
                            's3_pdf_url' => $publicUrl,
                        ]);
                    }
                    
                    // Also attach public URL to the response if needed
                    $resume['s3_pdf_url'] = $publicUrl;
                }
            } catch (\Exception $storeEx) {
                Log::error('Optimized storage update failed: ' . $storeEx->getMessage());
            }
            // ───────────────────────────────────────────────────────────────────────

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
