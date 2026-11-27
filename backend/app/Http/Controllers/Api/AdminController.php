<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\ResumeLead;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Mail\LeadContactEmail;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password) || !$user->is_admin) {
            return response()->json([
                'message' => 'Invalid credentials or you are not an administrator.'
            ], 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        ActivityLog::record(
            'ADMIN_LOGIN',
            "Admin '{$user->email}' logged in successfully.",
            'info',
            ['email' => $user->email],
            $request,
            $user->id
        );

        return response()->json([
            'user' => ['name' => $user->name, 'email' => $user->email],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            ActivityLog::record(
                'ADMIN_LOGOUT',
                "Admin '{$user->email}' logged out.",
                'info',
                ['email' => $user->email],
                $request,
                $user->id
            );
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function getLeads(Request $request)
    {
        $query = ResumeLead::query();

        // Sort
        $sort = $request->input('sort', 'newest');
        if ($sort === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } elseif ($sort === 'name_asc') {
            $query->orderBy('name', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Source filter
        if ($request->filled('source') && $request->source !== 'all') {
            $query->where('source', $request->source);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'new') {
                $query->where(function ($q) {
                    $q->where('status', 'new')->orWhereNull('status');
                });
            } else {
                $query->where('status', $request->status);
            }
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Only leads with resume data or PDF
        if ($request->boolean('has_resume')) {
            $query->where(function ($q) {
                $q->whereNotNull('s3_pdf_url')->orWhereNotNull('resume_data');
            });
        }

        $leads = $query->paginate($request->input('per_page', 25));

        // Flag duplicate emails: collect all emails in this result set that appear
        // more than once in the ENTIRE table so the UI can show a "Duplicate" badge.
        $emailsInPage = $leads->pluck('email')->filter()->unique()->values()->toArray();
        $duplicateEmails = [];
        if (!empty($emailsInPage)) {
            $duplicateEmails = ResumeLead::select('email')
                ->whereIn('email', $emailsInPage)
                ->groupBy('email')
                ->havingRaw('COUNT(*) > 1')
                ->pluck('email')
                ->toArray();
        }
        $duplicateSet = array_flip($duplicateEmails);

        $leads->getCollection()->transform(function ($lead) use ($duplicateSet) {
            $lead->is_duplicate = isset($duplicateSet[$lead->email]);
            return $lead;
        });

        return response()->json($leads);
    }

    public function createLead(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:new,reviewed,contacted,interviewing,hired,rejected',
            'notes' => 'nullable|string',
        ]);

        $lead = ResumeLead::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'source' => $validated['source'] ?? 'manual',
            'status' => $validated['status'] ?? 'new',
            'notes' => $validated['notes'] ?? null,
            'email_consent' => true,
        ]);

        ActivityLog::record(
            'LEAD_CREATED',
            "Manual lead '{$lead->name}' (ID: {$lead->id}) created.",
            'info',
            ['lead_id' => $lead->id],
            $request,
            $request->user()?->id
        );

        return response()->json(['message' => 'Lead created.', 'lead' => $lead], 201);
    }

    public function deleteLead(Request $request, $id)
    {
        $lead = ResumeLead::findOrFail($id);
        $leadName = $lead->name;
        $lead->delete();

        ActivityLog::record(
            'LEAD_DELETED',
            "Lead '{$leadName}' (ID: {$id}) was permanently deleted.",
            'warning',
            ['lead_id' => $id, 'lead_name' => $leadName],
            $request,
            $request->user()?->id
        );

        return response()->json(['message' => 'Lead deleted successfully.']);
    }

    public function updateLead(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|email|max:255',
            'phone' => 'sometimes|nullable|string|max:50',
            'source' => 'sometimes|nullable|string|max:50',
            'status' => 'sometimes|string',
            'notes' => 'sometimes|nullable|string',
        ]);

        $lead = ResumeLead::findOrFail($id);

        if ($request->has('name')) $lead->name = $request->name;
        if ($request->has('email')) $lead->email = $request->email;
        if ($request->has('phone')) $lead->phone = $request->phone;
        if ($request->has('source')) $lead->source = $request->source;
        if ($request->has('status')) $lead->status = $request->status;
        if ($request->has('notes')) $lead->notes = $request->notes;

        $lead->save();

        ActivityLog::record(
            'LEAD_UPDATED',
            "Lead '{$lead->name}' (ID: {$id}) was updated.",
            'info',
            array_filter(['status' => $request->status ?? null, 'notes_changed' => $request->has('notes')]),
            $request,
            $request->user()?->id
        );

        return response()->json([
            'message' => 'Lead updated successfully.',
            'lead' => $lead
        ]);
    }

    public function bulkUpdateLeads(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer',
            'status' => 'required|string|in:new,reviewed,contacted,interviewing,hired,rejected',
        ]);

        $count = ResumeLead::whereIn('id', $request->ids)->update(['status' => $request->status]);

        ActivityLog::record(
            'LEADS_BULK_UPDATED',
            "Bulk updated {$count} leads to status '{$request->status}'.",
            'info',
            ['ids' => $request->ids, 'status' => $request->status],
            $request,
            $request->user()?->id
        );

        return response()->json([
            'message' => "Updated {$count} leads.",
            'updated' => $count,
        ]);
    }

    public function bulkEmailLeads(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $leads = ResumeLead::whereIn('id', $request->ids)->whereNotNull('email')->get();
        $mailer = app(\App\Services\PHPMailerService::class);
        $sent = 0;
        $failed = 0;

        foreach ($leads as $lead) {
            if (!filter_var($lead->email, FILTER_VALIDATE_EMAIL)) {
                $failed++;
                continue;
            }
            $personalizedBody = str_replace('{name}', $lead->name ?: 'there', $request->body);
            try {
                $res = $mailer->sendLeadEmail($lead->email, $lead->name ?? 'Candidate', $request->subject, $personalizedBody);
                if ($res['success']) {
                    $sent++;
                    if (in_array($lead->status, ['new', 'reviewed', null])) {
                        $lead->update(['status' => 'contacted']);
                    }
                } else {
                    $failed++;
                }
            } catch (\Throwable $e) {
                $failed++;
            }
        }

        ActivityLog::record(
            'LEADS_BULK_EMAILED',
            "Bulk email sent to {$sent} leads ({$failed} failed): {$request->subject}",
            $failed > 0 ? 'warning' : 'info',
            ['sent' => $sent, 'failed' => $failed, 'subject' => $request->subject],
            $request,
            $request->user()?->id
        );

        return response()->json([
            'message' => "Sent {$sent} email(s)" . ($failed ? ", {$failed} failed." : "."),
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    public function getStats(Request $request)
    {
        $totalLeads = ResumeLead::count();
        $leadsToday = ResumeLead::whereDate('created_at', Carbon::today())->count();
        $leadsThisWeek = ResumeLead::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();

        // Weekly chart data (last 7 days)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $chartData[] = [
                'date' => $date->format('M d'),
                'count' => ResumeLead::whereDate('created_at', $date->toDateString())->count(),
            ];
        }

        // Source breakdown
        $sources = ResumeLead::select('source', DB::raw('count(*) as count'))
            ->whereNotNull('source')
            ->groupBy('source')
            ->get();

        return response()->json([
            'total_leads' => $totalLeads,
            'leads_today' => $leadsToday,
            'leads_this_week' => $leadsThisWeek,
            'chart_data' => $chartData,
            'sources' => $sources,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        ActivityLog::record(
            'PASSWORD_CHANGED',
            "Admin '{$user->email}' changed their password.",
            'warning',
            ['email' => $user->email],
            $request,
            $user->id
        );

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        $lead = ResumeLead::findOrFail($id);

        if (!$lead->email) {
            return response()->json(['message' => 'Lead has no email address.'], 400);
        }

        try {
            $mailer = app(\App\Services\PHPMailerService::class);
            $res = $mailer->sendLeadEmail($lead->email, $lead->name ?? 'Candidate', $request->subject, $request->body);
            
            if (!$res['success']) {
                // Fallback to Laravel Mail facade if PHPMailer encountered an error
                Mail::to($lead->email)->send(new LeadContactEmail($request->subject, $request->body));
            }

            ActivityLog::record(
                'EMAIL_SENT',
                "Email sent to {$lead->email}: {$request->subject}",
                'info',
                ['lead_id' => $lead->id, 'subject' => $request->subject],
                $request,
                $request->user()->id
            );

            // Update lead status to contacted automatically if not already further along
            if (in_array($lead->status, ['new', 'reviewed'])) {
                $lead->update(['status' => 'contacted']);
            }

            return response()->json(['message' => 'Email sent successfully.']);
        } catch (\Exception $e) {
            ActivityLog::record(
                'EMAIL_FAILED',
                "Failed to send email to {$lead->email}: " . $e->getMessage(),
                'error',
                ['lead_id' => $lead->id, 'error' => $e->getMessage()],
                $request,
                $request->user()->id
            );
            return response()->json(['message' => 'Failed to send email.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Serve a PDF for a lead (iframe preview or download).
     * Prefers the original stored file; falls back to generating from resume_data.
     */
    public function previewPdf(Request $request, $id)
    {
        $token = $request->query('token') ?: $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $pat = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        if (!$pat || !$pat->tokenable || !$pat->tokenable->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $lead = ResumeLead::findOrFail($id);
        $asDownload = $request->boolean('download');
        $filename = \Illuminate\Support\Str::slug($lead->name ?: 'resume') . '.pdf';

        $pdf = $this->resolveLeadPdf($lead);
        if (!$pdf) {
            return response()->json(['message' => 'Failed to load PDF document.'], 422);
        }

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => ($asDownload ? 'attachment' : 'inline') . '; filename="' . $filename . '"',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function resolveLeadPdf(ResumeLead $lead): ?string
    {
        $stored = $this->fetchStoredPdf($lead);
        if ($stored) {
            return $stored;
        }

        try {
            return $this->renderLeadPdf($lead);
        } catch (\Exception $e) {
            Log::error('Lead PDF render failed: ' . $e->getMessage(), ['lead_id' => $lead->id]);
            return null;
        }
    }

    private function fetchStoredPdf(ResumeLead $lead): ?string
    {
        if (!$lead->s3_pdf_url) {
            return null;
        }

        $url = $lead->s3_pdf_url;
        $key = $this->storageKeyFromUrl($url);

        if ($key) {
            foreach (['s3', 'public'] as $diskName) {
                try {
                    $disk = Storage::disk($diskName);
                    if ($disk->exists($key)) {
                        $contents = $disk->get($key);
                        if ($this->isPdf($contents)) {
                            return $contents;
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Lead PDF {$diskName} read failed: " . $e->getMessage(), [
                        'lead_id' => $lead->id,
                        'key' => $key,
                    ]);
                }
            }
        }

        try {
            $response = Http::timeout(20)->withHeaders(['Accept' => 'application/pdf'])->get($url);
            if ($response->successful() && $this->isPdf($response->body())) {
                return $response->body();
            }
        } catch (\Exception $e) {
            Log::warning('Lead PDF URL fetch failed: ' . $e->getMessage(), ['lead_id' => $lead->id]);
        }

        return null;
    }

    private function storageKeyFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (!is_string($path) || $path === '') {
            return null;
        }

        $path = rawurldecode($path);
        if (preg_match('#/(?:storage/)?(resumes/.+)$#', $path, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function isPdf(?string $contents): bool
    {
        if (!$contents) {
            return false;
        }

        return str_contains(substr($contents, 0, 8), '%PDF');
    }

    private function renderLeadPdf(ResumeLead $lead): string
    {
        $resume = new \stdClass();

        if ($lead->resume_data) {
            $resumeData = json_decode($lead->resume_data, true) ?: [];
            $resume->personal_info = $resumeData['personalInfo'] ?? [];
            $resume->summary = $resumeData['summary'] ?? '';
            $resume->skills = $resumeData['skills'] ?? [];
            $resume->experience = $resumeData['experience'] ?? [];
            $resume->education = $resumeData['education'] ?? [];
        } else {
            $skills = [];
            try { $skills = json_decode($lead->skills, true) ?? []; } catch (\Exception $e) {}

            $resume->personal_info = [
                'fullName' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
            ];
            $resume->summary = '';
            $resume->skills = $skills;
            $resume->experience = [];
            $resume->education = [];
        }

        $html = view('pdf.resume', ['resume' => $resume])->render();

        $options = new \Dompdf\Options();
        $options->set('defaultFont', 'Helvetica');
        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }
}
