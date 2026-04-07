<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('is_admin', true)->first();
        $adminId = $admin ? $admin->id : null;

        $posts = [
            [
                'title' => 'Top 10 Resume Keywords to Beat Any ATS in 2025',
                'slug' => 'top-10-resume-keywords-2025',
                'excerpt' => 'Discover the essential hard and soft skill keywords that Applicant Tracking Systems (ATS) actively scan for in 2025.',
                'content' => '<h2>Why Keywords Matter for ATS</h2><p>Applicant Tracking Systems (ATS) function as digital filters. They scan your resume for specific terminology mentioned in the job description. If your resume lacks these keywords, it may never reach a human recruiter.</p><h3>1. Artificial Intelligence (AI) and Machine Learning</h3><p>Even for non-technical roles, understanding how AI impacts your industry is a major trend for 2025...</p><h3>2. Data Literacy & Analytics</h3><p>Companies are moving toward data-driven decision-making. Skills like "Data Interpretation" and "Reporting" are high priority...</p><h3>3. Cross-functional Collaboration</h3><p>Soft skills are being quantified. Keywords like "Cross-departmental leadership" and "Stakeholder management" are highly effective.</p><h3>How to Use These Keywords</h3><p>Don\'t just list them in a skills section. Integrate them into your experience bullets using the STAR method for maximum impact.</p>',
                'meta_title' => 'Top Resume Keywords 2025 | Beat the ATS with ATSense',
                'meta_description' => 'Learn the top 10 keywords recruiters scan for in 2025. Boost your resume score and bypass ATS filters with these expert tips.',
                'is_published' => true,
                'author_id' => $adminId,
            ],
            [
                'title' => 'The Ultimate Guide to Modern Job Search Strategies',
                'slug' => 'modern-job-search-strategy-guide',
                'excerpt' => 'Stop "spray and pray" applications. Learn the 2025 framework for a targeted, high-conversion job search.',
                'content' => '<h2>The Shift in Job Hunting</h2><p>The 2025 job market requires a more sophisticated approach than simply applying to every LinkedIn posting. The "Hidden Job Market" now accounts for over 70% of hires.</p><h3>The 60-30-10 Rule</h3><ul><li><strong>60% Networking:</strong> Reaching out to peers, informational interviews, and LinkedIn engagement.</li><li><strong>30% Targeted Applications:</strong> High-quality, tailored applications via ATSense.</li><li><strong>10% Skill Building:</strong> Keeping your certifications up to date.</li></ul><h3>Optimizing Your LinkedIn Presence</h3><p>Your LinkedIn profile is your digital billboard. Ensure your headline is keyword-rich and matches your optimized resume...</p>',
                'meta_title' => 'Modern Job Search Strategy Guide 2025',
                'meta_description' => 'Master the new rules of job searching. Move beyond basic applications and learn how to tap into the hidden job market.',
                'is_published' => true,
                'author_id' => $adminId,
            ],
            [
                'title' => 'Mistakes to Avoid: Why Your Resume Is Being Rejected',
                'slug' => 'resume-rejection-mistakes-to-avoid',
                'excerpt' => 'Is your resume disappearing into the "black hole"? You might be making these common formatting or content mistakes.',
                'content' => '<h2>Common ATS Pitfalls</h2><p>Small errors can lead to immediate rejection by an ATS. Here is what to avoid:</p><h3>1. Complex Layouts</h3><p>Multi-column layouts and tables are beautiful to humans but confusing for machines. Stick to a clean, single-column document.</p><h3>2. Non-Standard Headings</h3><p>Avoid creative headers like "My Journey." Use "Work Experience" so the parser knows where to look.</p><h3>3. PDF Scans</h3><p>Never submit a scanned image saved as a PDF. The text must be selectable and readable by a machine.</p>',
                'meta_title' => 'Why Is My Resume Rejected? Common Errors Fixed',
                'meta_description' => 'Identify the top reasons resumes get rejected by ATS filters. Save your job search by fixing these common formatting mistakes.',
                'is_published' => true,
                'author_id' => $adminId,
            ]
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
