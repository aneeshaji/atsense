<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = 'https://atsense.online';
        $now = now()->toAtomString();

        $staticPages = [
            '/',
            '/builder',
            '/templates',
            '/blog',
            '/about',
            '/contact',
            '/resume-grader',
            '/linkedin-optimizer',
            '/interview-prep',
            '/cover-letters',
            '/job-matcher',
            '/privacy',
            '/terms',
            '/security',
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . $page . '</loc>';
            $xml .= '<lastmod>' . $now . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>' . ($page === '/' ? '1.0' : '0.8') . '</priority>';
            $xml .= '</url>';
        }

        // Dynamic Blog Posts
        $posts = Post::where('is_published', true)->get();
        foreach ($posts as $post) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/blog/' . $post->id . '</loc>';
            $xml .= '<lastmod>' . $post->updated_at->toAtomString() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>';
        }

        // Explicit Guides (if they follow a slug pattern)
        $guides = [
            'guide-ats',
            'guide-linkedin',
            'guide-resume',
            'guide-cover-letter',
            'guide-job-search',
            'guide-interview',
        ];
        foreach ($guides as $guide) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/guides/' . $guide . '</loc>';
            $xml .= '<lastmod>' . $now . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.7</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
