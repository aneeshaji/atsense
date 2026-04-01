<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dompdf\Dompdf;
use Dompdf\Options;

use App\Models\ResumeLead;

class ExportController extends Controller
{
    public function previewHtml(Request $request)
    {
        $resumeData = $request->input('resume');
        if (!$resumeData) {
            return response()->json(['message' => 'No resume data provided'], 400);
        }

        // Normalize data for the blade template
        $resume = new \stdClass();
        $resume->personal_info  = $resumeData['personalInfo'] ?? [];
        $resume->summary        = $resumeData['summary'] ?? '';
        $resume->skills         = $resumeData['skills'] ?? [];
        $resume->experience     = $resumeData['experience'] ?? [];
        $resume->education      = $resumeData['education'] ?? [];
        $resume->certifications = $resumeData['certifications'] ?? [];
        $resume->languages      = $resumeData['languages'] ?? [];
        
        return view('pdf.resume', ['resume' => $resume])->render();
    }

    public function exportPdfOffline(Request $request)
    {
        $resumeRaw = $request->input('resume');
        $resumeData = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

        if (!$resumeData) {
            return response()->json(['message' => 'No resume data provided'], 400);
        }

        $dompdf = $this->generatePdf($resumeData);
        $pdfOutput = $dompdf->output();

        // Background Upload to R2
        $this->uploadToR2($resumeData, $pdfOutput);

        return response()->streamDownload(function () use ($pdfOutput) {
            echo $pdfOutput;
        }, 'resume.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Silent snapshot — generates and uploads without returning a download
     */
    public function snapshot(Request $request)
    {
        $resumeRaw = $request->input('resume');
        $resumeData = is_string($resumeRaw) ? json_decode($resumeRaw, true) : $resumeRaw;

        if (!$resumeData) {
            return response()->json(['message' => 'No resume data provided'], 200);
        }

        try {
            $dompdf = $this->generatePdf($resumeData);
            $pdfOutput = $dompdf->output();
            $this->uploadToR2($resumeData, $pdfOutput);
            return response()->json(['status' => 'snapshot_taken'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'snapshot_failed', 'error' => $e->getMessage()], 200);
        }
    }

    private function generatePdf($resumeData)
    {
        // Normalize data for the blade template which expects snake_case and specific structures
        $resume = new \stdClass();
        $resume->personal_info  = $resumeData['personalInfo'] ?? [];
        $resume->summary        = $resumeData['summary'] ?? '';
        $resume->skills         = $resumeData['skills'] ?? [];
        $resume->experience     = $resumeData['experience'] ?? [];
        $resume->education      = $resumeData['education'] ?? [];
        $resume->certifications = $resumeData['certifications'] ?? [];
        $resume->languages      = $resumeData['languages'] ?? [];
        
        $html = view('pdf.resume', ['resume' => $resume])->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf;
    }

    private function uploadToR2($resumeData, $pdfOutput)
    {
        try {
            $personalInfo = $resumeData['personalInfo'] ?? [];
            $email = $personalInfo['email'] ?? null;
            $name  = $personalInfo['fullName'] ?? null;
            $phone = $personalInfo['phone'] ?? null;

            \Illuminate\Support\Facades\Log::info('Attempting R2 upload for: ' . ($email ?? 'no-email'));

            if ($email || $name || $phone) {
                $dateDir  = date('Y-m-d');
                $safeName = \Illuminate\Support\Str::slug($name ?: 'user');
                $fileName = "resumes/{$dateDir}/{$safeName}_" . time() . ".pdf";

                $disk   = \Illuminate\Support\Facades\Storage::disk('s3');
                $result = $disk->put($fileName, $pdfOutput, 'public');

                \Illuminate\Support\Facades\Log::info('R2 Put Result: ' . ($result ? 'Success' : 'Failed'));

                if ($result) {
                    // Build the public URL for this object
                    $publicUrl = $disk->url($fileName);

                    // Save the URL back to the lead record so admin can download it
                    $leadEmail = $email ?: 'unknown_' . uniqid();
                    ResumeLead::updateOrCreate(
                        ['email' => $leadEmail],
                        [
                            'name'        => $name,
                            'phone'       => $phone,
                            's3_pdf_url'  => $publicUrl,
                            'resume_data' => json_encode($resumeData),
                            'source'      => 'export',
                        ]
                    );

                    \Illuminate\Support\Facades\Log::info('Lead s3_pdf_url saved: ' . $publicUrl);
                }
            }
        } catch (\Exception $leadEx) {
            \Illuminate\Support\Facades\Log::error('Lead snapshot failed: ' . $leadEx->getMessage());
        }
    }
}
