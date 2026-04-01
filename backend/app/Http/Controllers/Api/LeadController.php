<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResumeLead;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    /**
     * Capture lead data sent directly from the frontend Builder.
     * Stores both contact info AND full resume JSON for admin preview.
     */
    public function capture(Request $request)
    {
        try {
            $personalInfo = $request->input('personalInfo', []);
            $skills = $request->input('skills', []);
            $resumeData = $request->input('resume', null);

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
                'source' => $request->input('source', 'builder'),
            ];

            // Store full resume JSON if provided
            if ($resumeData) {
                $data['resume_data'] = json_encode($resumeData);
            }

            ResumeLead::updateOrCreate(
                ['email' => $email ?: 'unknown_' . uniqid()],
                $data
            );

            return response()->json(['status' => 'captured'], 200);

        } catch (\Exception $e) {
            Log::error('Frontend lead capture failed: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }
}
