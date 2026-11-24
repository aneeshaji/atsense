<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeLead extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'skills',
        'resume_data',
        'source',
        's3_pdf_url',
        'status',
        'notes',
        'job_title',
        'job_description',
        'email_consent',
        'welcome_email_sent_at',
        'drip_day2_sent_at',
        'drip_day5_sent_at',
        'drip_day7_sent_at',
    ];

    protected $casts = [
        'email_consent'        => 'boolean',
        'welcome_email_sent_at' => 'datetime',
        'drip_day2_sent_at'    => 'datetime',
        'drip_day5_sent_at'    => 'datetime',
        'drip_day7_sent_at'    => 'datetime',
    ];
}
