<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ParseService;
use App\Services\AIService;
use App\Models\ResumeLead;
use App\Models\Resume;
use App\Models\ActivityLog;
use App\Mail\ResumeImportedMail;
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
            
            // Upload immediately to S3 Storage
            $dateDir  = date('Y-m-d');
            $extension = $file->getClientOriginalExtension() ?: 'pdf';
            $fileName = "resumes/{$dateDir}/original_" . time() . "_" . \Illuminate\Support\Str::slug($file->getClientOriginalName()) . "." . $extension;
            
            $publicUrl = null;
            try {
                $disk = \Illuminate\Support\Facades\Storage::disk('s3');
                $disk->put($fileName, file_get_contents($file->getRealPath()), 'public');
                $publicUrl = $disk->url($fileName);
            } catch (\Exception $e) {
                Log::warning('S3 Upload failed, falling back to local public disk: ' . $e->getMessage());
                try {
                    $disk = \Illuminate\Support\Facades\Storage::disk('public');
                    $disk->put($fileName, file_get_contents($file->getRealPath()));
                    $publicUrl = url('storage/' . $fileName);
                } catch (\Exception $e2) {
                    Log::warning('Local upload also failed: ' . $e2->getMessage());
                }
            }

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

            // ── Silent lead capture on import ─────────────────────────────────────
            try {
                $pi    = $resume['personalInfo'];
                $email = $pi['email'] ?? null;
                if ($email || ($pi['fullName'] ?? null) || ($pi['phone'] ?? null)) {
                    ResumeLead::updateOrCreate(
                        ['email' => $email ?: ('unknown_' . uniqid())],
                        [
                            'name'        => $pi['fullName'] ?? null,
                            'phone'       => $pi['phone'] ?? null,
                            'skills'      => json_encode($resume['skills'] ?? []),
                            'resume_data' => json_encode($resume),
                            'source'      => 'import',
                            's3_pdf_url'  => $publicUrl,
                        ]
                    );

                    // ── Send Nurturing Email (Async) ─────────────────────────────────
                    if ($email) {
                        try {
                            \Illuminate\Support\Facades\Mail::to($email)
                                ->queue(new \App\Mail\ResumeImportedMail($pi['fullName'] ?: 'Partner'));
                        } catch (\Exception $mailEx) {
                            Log::warning('Nurturing email failed: ' . $mailEx->getMessage());
                        }
                    }
                }
            } catch (\Exception $leadEx) {
                Log::warning('Lead capture after import failed: ' . $leadEx->getMessage());
            }
            // ── Save Main Resume Record ──────────────────────────────────────────
            try {
                $savedResume = Resume::create([
                    'user_id'         => auth()->check() ? auth()->id() : null,
                    'title'           => $resume['title'] ?? 'Imported Resume',
                    'personal_info'   => $resume['personalInfo'] ?? [],
                    'summary'         => $resume['summary'] ?? '',
                    'skills'          => $resume['skills'] ?? [],
                    'experience'      => $resume['experience'] ?? [],
                    'education'       => $resume['education'] ?? [],
                    'ats_score'       => 0,
                    'job_description' => null,
                ]);
                $resume['id'] = $savedResume->id;
            } catch (\Exception $resumeEx) {
                Log::warning('Resume record save failed: ' . $resumeEx->getMessage());
            }
            // ─────────────────────────────────────────────────────────────────────

            ActivityLog::record(
                'RESUME_UPLOAD',
                "Resume uploaded: " . ($resume['personalInfo']['fullName'] ?: 'Unknown User'),
                'info',
                ['file' => $file->getClientOriginalName(), 'url' => $publicUrl],
                $request,
                auth()->check() ? auth()->id() : null
            );

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
