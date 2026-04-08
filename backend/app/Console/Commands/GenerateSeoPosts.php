<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateSeoPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seo:generate-posts {--count=1 : Number of posts to generate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically generates and seeds SEO-optimized blog posts using OpenAI.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = (int) $this->option('count');
        $apiKey = env('OPENAI_API_KEY');

        if (!$apiKey) {
            $this->error('OPENAI_API_KEY is not set in .env');
            return;
        }

        $topics = [
            "ATS Resume for Data Scientist",
            "ATS Resume Template for Registered Nurses",
            "Project Manager ATS Keywords 2025",
            "How to Format a Software Engineer ATS Resume",
            "Customer Success Manager ATS Cheat Sheet",
            "Marketing Director Resume ATS Optimization",
            "Financial Analyst ATS Resume Guide",
            "UX Designer ATS Resume Formatting Rules",
            "Sales Executive ATS Resume Best Practices",
            "Human Resources Manager ATS Bypass Strategies",
        ];

        // Shuffle and pick
        shuffle($topics);
        $selectedTopics = array_slice($topics, 0, $count);

        foreach ($selectedTopics as $topic) {
            $this->info("Generating article for: {$topic}");

            $prompt = "You are an expert career strategist and SEO copywriter. Write a highly engaging, SEO-optimized blog post about '{$topic}'. 
            The purpose of the post is to capture job seekers and convince them to test their resume on our free 'ATS Resume Grader' tool.
            Output your response as a JSON object with exactly these keys:
            - 'title': A clicky, SEO title (max 70 chars)
            - 'excerpt': A short 2-sentence summary
            - 'meta_title': Meta title for SEO
            - 'meta_description': Meta description for SEO (max 160 chars)
            - 'content': The full HTML content of the post (using <h2>, <h3>, <p>, <ul>). At the end of the post, strongly pitch testing their resume at the link: <a href='/resume-grader'>ATSense Free Resume Grader</a>.
            - 'category': A short category name (e.g. 'ATS Tips', 'Job Search', 'Templates')";

            $response = Http::withToken($apiKey)->timeout(120)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'Output ONLY valid JSON. No markdown wrappers like ```json.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->failed()) {
                $this->error("Failed to call OpenAI for topic: {$topic}");
                continue;
            }

            try {
                // OpenAI might wrap it in markdown even when told not to sometimes, let's strip it if it did
                $jsonString = $response->json('choices.0.message.content');
                $jsonString = str_replace(['```json', '```'], '', $jsonString);
                $data = json_decode(trim($jsonString), true);

                if (!$data || !isset($data['title'])) {
                    $this->error("Invalid JSON response for topic: {$topic}");
                    continue;
                }

                $slug = Str::slug($data['title']);
                
                // Set a placeholder generic image
                $images = [
                    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
                    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80',
                    'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80'
                ];
                $coverImage = $images[array_rand($images)];

                DB::table('posts')->insertOrIgnore([
                    'title' => $data['title'],
                    'slug' => $slug,
                    'category' => $data['category'] ?? 'ATS Tips',
                    'excerpt' => $data['excerpt'],
                    'content' => $data['content'],
                    'cover_image' => $coverImage,
                    'meta_title' => $data['meta_title'],
                    'meta_description' => $data['meta_description'],
                    'is_published' => true,
                    'author_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->info("✅ Successfully created: {$data['title']}");

            } catch (\Exception $e) {
                $this->error("Exception: " . $e->getMessage());
            }
        }
        
        $this->info("Done generating posts!");
    }
}
