<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'personal_info',
        'summary',
        'skills',
        'experience',
        'education',
        'ats_score',
        'job_description',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'skills' => 'array',
        'experience' => 'array',
        'education' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coverLetters()
    {
        return $this->hasMany(CoverLetter::class);
    }
}
