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
    ];
}
