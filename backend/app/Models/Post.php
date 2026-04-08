<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'content',
        'excerpt',
        'cover_image',
        'meta_title',
        'meta_description',
        'is_published',
        'author_id'
    ];
}
