<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * GET /admin/activity-logs
     * Returns paginated activity logs with optional filters.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::orderBy('created_at', 'desc');

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('action')) {
            $query->where('action', 'like', '%' . strtoupper($request->action) . '%');
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('message', 'like', "%{$s}%")
                  ->orWhere('action', 'like', "%{$s}%")
                  ->orWhere('ip_address', 'like', "%{$s}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate($request->input('per_page', 50));

        return response()->json($logs);
    }

    /**
     * DELETE /admin/activity-logs
     * Purges all logs. Useful to clear noise.
     */
    public function purge(Request $request)
    {
        $count = ActivityLog::count();
        ActivityLog::truncate();

        ActivityLog::record(
            'LOGS_PURGED',
            "Admin purged {$count} activity log entries.",
            'warning',
            ['purged_count' => $count],
            $request,
            $request->user()?->id
        );

        return response()->json(['message' => "Purged {$count} log entries."]);
    }
}
