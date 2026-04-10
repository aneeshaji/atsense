<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'level',
        'action',
        'message',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Convenience logger — call from anywhere in the app.
     *
     * @param string      $action   Short event key e.g. 'LOGIN', 'LEAD_DELETED'
     * @param string      $message  Human-readable description
     * @param string      $level    info | warning | error | critical
     * @param array|null  $metadata Extra context to store as JSON
     * @param Request|null $request  If provided, captures IP + UA automatically
     * @param int|null    $userId
     */
    public static function record(
        string $action,
        string $message,
        string $level = 'info',
        ?array $metadata = null,
        ?Request $request = null,
        ?int $userId = null
    ): self {
        return self::create([
            'action'     => strtoupper($action),
            'message'    => $message,
            'level'      => $level,
            'metadata'   => $metadata,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'user_id'    => $userId,
        ]);
    }
}
