<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResumeLead;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    /**
     * Capture lead at import time.
     * Called immediately after a resume is parsed — stores identity + resume data.
     * Uses updateOrCreate on email to prevent duplicates.
     */
    public function capture(Request $request)
    {
        try {
            $personalInfo = $request->input('personalInfo', []);
            $skills       = $request->input('skills', []);
            $resumeData   = $request->input('resume', null);

            $email = $personalInfo['email'] ?? null;
            $name  = $personalInfo['fullName'] ?? null;
            $phone = $personalInfo['phone'] ?? null;

            // Only capture if we have at least one identifying field
            if (!$email && !$name && !$phone) {
                return response()->json(['status' => 'skipped'], 200);
            }

            $data = [
                'name'   => $name,
                'phone'  => $phone,
                'skills' => json_encode($skills),
                'source' => $request->input('source', 'import'),
            ];

            if ($resumeData) {
                $data['resume_data'] = is_string($resumeData)
                    ? $resumeData
                    : json_encode($resumeData);
            }

            $leadEmail = $email ?: ('unknown_' . uniqid());

            ResumeLead::updateOrCreate(
                ['email' => $leadEmail],
                $data
            );

            return response()->json(['status' => 'captured'], 200);

        } catch (\Exception $e) {
            Log::error('Lead capture failed: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Update an existing lead after AI optimization.
     * Matches by email to avoid duplicates, enriches with job context + optimized resume.
     */
    public function update(Request $request)
    {
        try {
            $email          = $request->input('email');
            $resumeData     = $request->input('resume');
            $jobTitle       = $request->input('job_title');
            $jobDescription = $request->input('job_description');

            if (!$email) {
                return response()->json(['status' => 'skipped', 'reason' => 'no_email'], 200);
            }

            $data = [
                'source' => 'optimized',
            ];

            if ($jobTitle)       $data['job_title']       = $jobTitle;
            if ($jobDescription) $data['job_description'] = $jobDescription;

            if ($resumeData) {
                $data['resume_data'] = is_string($resumeData)
                    ? $resumeData
                    : json_encode($resumeData);

                // Refresh skills from optimized resume
                $parsed = is_string($resumeData) ? json_decode($resumeData, true) : $resumeData;
                if (!empty($parsed['skills'])) {
                    $data['skills'] = json_encode($parsed['skills']);
                }
            }

            // Only update existing; don't create orphan records without identity
            $lead = ResumeLead::where('email', $email)->first();
            if ($lead) {
                $lead->update($data);
                return response()->json(['status' => 'updated'], 200);
            }

            // Fallback: create if somehow the import lead wasn't stored
            $name  = null;
            $phone = null;
            if ($resumeData) {
                $parsed = is_string($resumeData) ? json_decode($resumeData, true) : $resumeData;
                $name  = $parsed['personalInfo']['fullName'] ?? null;
                $phone = $parsed['personalInfo']['phone'] ?? null;
            }
            $data['name']  = $name;
            $data['phone'] = $phone;
            ResumeLead::create(array_merge(['email' => $email], $data));

            return response()->json(['status' => 'created'], 200);

        } catch (\Exception $e) {
            Log::error('Lead update failed: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }
}
