<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoverLetter extends Model
{
    protected $fillable = [
        'user_id',
        'resume_id',
        'job_title',
        'company_name',
        'job_description',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
