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

    /**
     * Scrape URL or Raw Text to instantly extract Job Details
     */
    public function extractJobOffline(Request $request)
    {
        $input = $request->input('url_or_text');
        
        if (!$input) {
             return response()->json(['message' => 'Input is required.'], 422);
        }

        $rawText = $input;

        // If it looks like a URL, try to fetch it first.
        if (filter_var($input, FILTER_VALIDATE_URL)) {
             try {
                 $client = new \GuzzleHttp\Client();
                 $response = $client->request('GET', $input, [
                     'headers' => [
                         'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                         'Accept' => 'text/html,application/xhtml+xml,application/xml',
                         'Accept-Language' => 'en-US,en;q=0.9',
                     ],
                     'timeout' => 8,
                     'allow_redirects' => true,
                     'http_errors' => false
                 ]);

                 if ($response->getStatusCode() === 200) {
                     $html = (string) $response->getBody();
                     // Basic cleanup to reduce token size
                     $cleaned = preg_replace([
                         '@<head[^>]*?>.*?</head>@siu',
                         '@<style[^>]*?>.*?</style>@siu',
                         '@<script[^>]*?.*?</script>@siu',
                         '@<nav[^>]*?>.*?</nav>@siu',
                         '@<footer[^>]*?>.*?</footer>@siu',
                     ], '', $html);
                     $rawText = strip_tags($cleaned);
                     $rawText = preg_replace('/\s+/', ' ', $rawText);
                 }
                 // If status is 403 (blocked by LinkedIn), we just pass the URL string to AI? 
                 // No, AI can't browse natively via standard chat endpoint easily unless using tools.
                 // We will just process what we got (or fallback to error if empty).
             } catch (\Exception $e) {
                 Log::warning('Job Scrape failed: ' . $e->getMessage());
             }
        }

        if (strlen($rawText) < 50) {
             return response()->json([
                 'message' => 'Failed to extract content.',
                 'suggestion' => 'Anti-bot protection blocked the extraction. Please select all text on the job page (Ctrl+A), copy it (Ctrl+C), and paste it directly into the box.'
             ], 403);
        }

        try {
            $jobData = $this->aiService->extractJobFromText($rawText);
            return response()->json($jobData);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI Extraction failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
