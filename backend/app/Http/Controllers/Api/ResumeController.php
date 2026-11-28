<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ParseService;
use App\Services\AIService;
use App\Models\ResumeLead;
use App\Models\Resume;
use App\Models\ActivityLog;
use App\Services\PHPMailerService;
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

            // 1. Save locally immediately to public storage (fast & non-blocking)
            $dateDir      = date('Y-m-d');
            $extension    = $file->getClientOriginalExtension() ?: 'pdf';
            $fileName     = "resumes/{$dateDir}/original_" . time() . "_" . \Illuminate\Support\Str::slug($file->getClientOriginalName()) . "." . $extension;
            $fileContents = file_get_contents($file->getRealPath());

            $publicUrl = null;
            try {
                \Illuminate\Support\Facades\Storage::disk('public')->put($fileName, $fileContents);
                $publicUrl = url('storage/' . $fileName);
            } catch (\Throwable $e) {
                Log::warning('Local file storage failed: ' . $e->getMessage());
            }

            // 2. Extract Text
            $parseService = new ParseService();
            $text         = $parseService->extractText($file);
            Log::info('Text extraction complete. Length: ' . strlen($text));

            // Sanitize text
            if (!empty($text)) {
                $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
            }

            if (empty($text) || strlen($text) < 20) {
                Log::error('Extraction produced too little text');
                return response()->json([
                    'message' => 'Could not read resume content',
                    'error'   => 'The file might be empty, password-protected, or unsupported.',
                ], 422);
            }

            // 3. Parse with AI (Fast model: qwen/qwen3.8-27b)
            $aiService  = app(AIService::class);
            Log::info('Connecting to AI for parsing...');
            $parsedData = $aiService->parseResumeJSON($text);

            if (!$parsedData) {
                Log::error('AI Parsing returned null');
                throw new \Exception('AI failed to interpret the resume data structure.');
            }

            // 4. Map to dynamic Resume object
            $resume = [
                'title'          => 'Imported Resume',
                'personalInfo'   => [
                    'fullName'  => $parsedData['personalInfo']['fullName']  ?? null,
                    'email'     => $parsedData['personalInfo']['email']     ?? null,
                    'phone'     => $parsedData['personalInfo']['phone']     ?? null,
                    'location'  => $parsedData['personalInfo']['location']  ?? null,
                    'linkedin'  => $parsedData['personalInfo']['linkedin']  ?? null,
                    'github'    => $parsedData['personalInfo']['github']    ?? null,
                    'portfolio' => $parsedData['personalInfo']['portfolio'] ?? null,
                ],
                'summary'        => $parsedData['summary']        ?? '',
                'skills'         => $parsedData['skills']         ?? [],
                'experience'     => $parsedData['experience']     ?? [],
                'education'      => $parsedData['education']      ?? [],
                'certifications' => $parsedData['certifications'] ?? [],
                'projects'       => $parsedData['projects']       ?? [],
                'languages'      => $parsedData['languages']      ?? [],
                'atsScore'       => 0,
            ];

            Log::info('Import successful for: ' . ($resume['personalInfo']['fullName'] ?: 'Unknown User'));

            // 5. Capture lead synchronously (fast DB write ~10ms) so it's guaranteed to persist
            // even if background terminating callbacks are interrupted on shared hosting.
            $pi               = $resume['personalInfo'];
            $email            = !empty($pi['email'])    ? trim($pi['email'])    : null;
            $name             = !empty($pi['fullName']) ? trim($pi['fullName']) : null;
            $resumeSnapshot   = $resume;
            $fileNameSnapshot = $fileName;
            $fileDataSnapshot = $fileContents;
            $publicUrlSnap    = $publicUrl;
            $originalName     = $file->getClientOriginalName();

            $leadId = null;
            $hasConsentCol = false;
            $hasWelcomeCol = false;
            try {
                $hasConsentCol = \Illuminate\Support\Facades\Schema::hasColumn('resume_leads', 'email_consent');
                $hasWelcomeCol = \Illuminate\Support\Facades\Schema::hasColumn('resume_leads', 'welcome_email_sent_at');

                if ($email || $name || !empty($pi['phone'])) {
                    $leadPayload = [
                        'name'        => $name,
                        'phone'       => $pi['phone'] ?? null,
                        'skills'      => json_encode($resumeSnapshot['skills'] ?? []),
                        'resume_data' => json_encode($resumeSnapshot),
                        'source'      => 'import',
                        's3_pdf_url'  => $publicUrlSnap,
                    ];
                    if ($hasConsentCol) {
                        $leadPayload['email_consent'] = true;
                    }

                    // Always create a new lead row — allow retries / duplicates.
                    // Welcome-email dedup is handled below using welcome_email_sent_at.
                    $lead   = ResumeLead::create(array_merge(
                        ['email' => $email ?: ('unknown_' . uniqid())],
                        $leadPayload
                    ));
                    $leadId = $lead->id;
                }
            } catch (\Throwable $leadEx) {
                Log::warning('Sync lead capture skipped: ' . $leadEx->getMessage());
            }

            // 6. Defer slow external I/O (S3 upload, Resume record, ActivityLog, SMTP email) to terminating
            app()->terminating(function () use (
                $leadId, $hasWelcomeCol, $email, $name, $resumeSnapshot,
                $fileNameSnapshot, $fileDataSnapshot, $publicUrlSnap, $originalName
            ) {
                // Flush HTTP response to client immediately on LiteSpeed / PHP-FPM
                if (function_exists('litespeed_finish_request')) {
                    @litespeed_finish_request();
                } elseif (function_exists('fastcgi_finish_request')) {
                    @fastcgi_finish_request();
                }

                // Background S3 upload (only if S3 credentials are configured)
                $s3Url = null;
                if (config('filesystems.disks.s3.key') && config('filesystems.disks.s3.bucket')) {
                    try {
                        $s3Disk = \Illuminate\Support\Facades\Storage::disk('s3');
                        $s3Disk->put($fileNameSnapshot, $fileDataSnapshot, 'public');
                        $s3Url = $s3Disk->url($fileNameSnapshot);
                        if ($leadId && $s3Url) {
                            ResumeLead::where('id', $leadId)->update(['s3_pdf_url' => $s3Url]);
                        }
                    } catch (\Throwable $s3Ex) {
                        Log::warning('Background S3 upload skipped: ' . $s3Ex->getMessage());
                    }
                }

                // Background resume DB record
                try {
                    Resume::create([
                        'user_id'         => auth()->check() ? auth()->id() : null,
                        'title'           => $resumeSnapshot['title'] ?? 'Imported Resume',
                        'personal_info'   => $resumeSnapshot['personalInfo'] ?? [],
                        'summary'         => $resumeSnapshot['summary']      ?? '',
                        'skills'          => $resumeSnapshot['skills']       ?? [],
                        'experience'      => $resumeSnapshot['experience']   ?? [],
                        'education'       => $resumeSnapshot['education']    ?? [],
                        'ats_score'       => 0,
                        'job_description' => null,
                    ]);
                } catch (\Throwable $resEx) {
                    Log::warning('Background resume record save skipped: ' . $resEx->getMessage());
                }

                // Background activity log
                try {
                    ActivityLog::record(
                        'RESUME_UPLOAD',
                        'Resume uploaded: ' . ($resumeSnapshot['personalInfo']['fullName'] ?: 'Unknown User'),
                        'info',
                        ['file' => $originalName, 'url' => $s3Url ?: $publicUrlSnap]
                    );
                } catch (\Throwable $actEx) {
                    Log::warning('Background activity log skipped: ' . $actEx->getMessage());
                }

                // Background welcome & nudge email (Deep Tailor showcase) — send on every upload/retry
                if ($email) {
                    try {
                        $mailer = app(PHPMailerService::class);
                        $result = $mailer->sendWelcomeAndNudgeEmail($name ?: 'there', $email);
                        if ($result['success']) {
                            if ($leadId && $hasWelcomeCol) {
                                ResumeLead::where('id', $leadId)->update(['welcome_email_sent_at' => now()]);
                            }
                            Log::info("Welcome email sent successfully to {$email} (lead #{$leadId})");
                        } else {
                            Log::warning("Welcome email failed for {$email}: " . ($result['error'] ?? $result['message'] ?? 'unknown'));
                        }
                    } catch (\Throwable $mailEx) {
                        Log::warning('Background welcome email skipped: ' . $mailEx->getMessage());
                    }
                }
            });

            return response()->json($resume, 200);

        } catch (\Exception $e) {
            Log::error('IMPORT CRASH: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Critical Import Error',
                'error'   => $e->getMessage(),
                'file'    => $file->getClientOriginalName() ?? 'unknown',
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

            // Persist the score to DB if ID is provided
            try {
                if (!empty($resume['id'])) {
                    $existing = Resume::find($resume['id']);
                    if ($existing) {
                        $existing->update([
                            'ats_score' => $analysis['overallScore'] ?? 0
                        ]);
                    }
                }
            } catch (\Exception $saveEx) {
                Log::warning('Failed to persist ATS score to DB: ' . $saveEx->getMessage());
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
