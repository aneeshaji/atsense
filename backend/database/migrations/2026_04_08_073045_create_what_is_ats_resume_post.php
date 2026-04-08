<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add category column if missing
        if (!Schema::hasColumn('posts', 'category')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->string('category')->nullable()->after('slug');
            });
        }

        // Insert the highly-optimized SEO blog post
        $content = <<<EOT
<p>If you've spent any time looking for a job recently, you've probably heard the term "ATS" thrown around constantly. But what exactly is an ATS resume? Why do you need one? And most importantly, how do you know if your resume is ATS-friendly?</p>

<h2>What is an Applicant Tracking System (ATS)?</h2>
<p>An <strong>Applicant Tracking System (ATS)</strong> is a type of software used by recruiters and HR departments to scan, sort, and rank job applications. Think of it as a robotic gatekeeper. When you apply for a job at a medium-to-large company, a human doesn't read it first—the ATS bot does.</p>
<p>The ATS scans your document for specific keywords, skills, and formatting. If it cannot read your document, or if you lack the required keywords, it automatically rejects your application. <em>Over 75% of resumes are never seen by human eyes because of this system.</em></p>

<h2>What Makes a Resume "ATS-Friendly"?</h2>
<p>An ATS resume is specifically formatted to be perfectly machine-readable by these systems. Here are the core rules of an ATS resume:</p>
<ol>
<li><strong>No Complex Formatting:</strong> Tables, columns, graphics, and text boxes confuse the parser. Use a standard, linear single-column layout.</li>
<li><strong>Standard Headings:</strong> Don't use cute headings like "My Career Journey." Use standard terms like "Experience," "Education," and "Skills."</li>
<li><strong>Exact Keyword Matching:</strong> If the job description asks for "Search Engine Optimization," do not just write "SEO." Write exactly what the system is scanning for.</li>
<li><strong>No Headers or Footers:</strong> Many ATS parsers cannot read data stored in the header or footer of a document (which is where many people put their contact information!).</li>
</ol>

<h2>How to Check if Your Resume is ATS Compliant</h2>
<p>The hardest part about dealing with Applicant Tracking Systems is that you usually get zero feedback. You apply, and it just goes into a black hole.</p>
<p>To fix this, you need to use an <strong>ATS Resume Checker</strong>. At ATSense, we built a free diagnostic tool that mimics exactly how systems like Workday, Greenhouse, and Taleo parse your document.</p>

<p>👉 <strong><a href="/resume-grader">Click here to use our Free ATS Resume Checker</a></strong></p>

<p>Simply upload your PDF, and our analyzer will instantly scan its structure, keyword density, and formatting, giving you a comprehensive ATS Score so you know exactly what to fix before you apply.</p>
EOT;

        DB::table('posts')->insertOrIgnore([
            'title' => 'What is an ATS Resume? (And How to Make One)',
            'slug' => 'what-is-ats-resume',
            'category' => 'ATS Tips',
            'excerpt' => 'Over 75% of resumes are rejected by bots before a human ever sees them. Learn exactly what an Applicant Tracking System (ATS) is and how to bypass it.',
            'content' => $content,
            'meta_title' => 'What is an ATS Resume? (How to Bypass Applicant Tracking Systems)',
            'meta_description' => 'What is an ATS resume? Learn how Applicant Tracking Systems work, what an ATS resume checker is, and how to format your resume to get hired fast.',
            'is_published' => true,
            'author_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('posts')->where('slug', 'what-is-ats-resume')->delete();
    }
};
