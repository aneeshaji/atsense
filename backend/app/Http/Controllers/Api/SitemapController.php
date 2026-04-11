<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $baseUrl = env('CLIENT_URL', 'https://atsense.online');
        if ($baseUrl === 'http://localhost:3000') {
            $baseUrl = 'https://atsense.online'; // Force production URL for sitemap SEO
        }
        $urls = [
            ['loc' => $baseUrl . '/', 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => $baseUrl . '/builder', 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => $baseUrl . '/resume-grader', 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => $baseUrl . '/interview-simulator', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => $baseUrl . '/linkedin-optimizer', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => $baseUrl . '/cover-letter-generator', 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => $baseUrl . '/blog', 'changefreq' => 'daily', 'priority' => '0.7'],
            ['loc' => $baseUrl . '/about', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $baseUrl . '/contact', 'changefreq' => 'monthly', 'priority' => '0.5'],
        ];

        // Add Posts
        $posts = Post::where('is_published', true)->orderBy('updated_at', 'desc')->get();
        foreach ($posts as $post) {
            $urls[] = [
                'loc' => $baseUrl . '/blog/' . ($post->slug ?? $post->id),
                'lastmod' => $post->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.6'
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($url['loc']) . '</loc>';
            if (isset($url['lastmod'])) {
                $xml .= '<lastmod>' . $url['lastmod'] . '</lastmod>';
            }
            $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $url['priority'] . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
