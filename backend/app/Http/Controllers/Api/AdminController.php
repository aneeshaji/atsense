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
        $query = ResumeLead::orderBy('created_at', 'desc');

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

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $leads = $query->paginate($request->input('per_page', 25));
        return response()->json($leads);
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
            'status' => 'sometimes|string',
            'notes' => 'sometimes|nullable|string',
        ]);

        $lead = ResumeLead::findOrFail($id);
        
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

    /**
     * Generate and serve a PDF preview for a specific lead.
     * Returns an inline PDF so it renders inside an iframe.
     */
    public function previewPdf(Request $request, $id)
    {
        // Authenticate via query token (iframes can't send auth headers)
        $token = $request->query('token');
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $pat = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        if (!$pat || !$pat->tokenable || !$pat->tokenable->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $lead = ResumeLead::findOrFail($id);

        // Build resume object for the Blade template
        $resume = new \stdClass();

        if ($lead->resume_data) {
            // Use stored full resume data — same format the frontend sends
            $resumeData = json_decode($lead->resume_data, true);
            $resume->personal_info = $resumeData['personalInfo'] ?? [];
            $resume->summary = $resumeData['summary'] ?? '';
            $resume->skills = $resumeData['skills'] ?? [];
            $resume->experience = $resumeData['experience'] ?? [];
            $resume->education = $resumeData['education'] ?? [];
        } else {
            // Fallback: build from basic lead fields
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

        // Render using the same Blade template the frontend preview uses
        $html = view('pdf.resume', ['resume' => $resume])->render();

        $options = new \Dompdf\Options();
        $options->set('defaultFont', 'Helvetica');
        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . \Illuminate\Support\Str::slug($lead->name ?: 'resume') . '.pdf"',
        ]);
    }
}
