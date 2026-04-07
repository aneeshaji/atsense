<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'setting_key' => 'site_title',
                'setting_value' => 'ATSense | AI-Powered Resume Intelligence & Optimization',
                'description' => 'The global title tag used for the website brand.',
            ],
            [
                'setting_key' => 'maintenance_mode',
                'setting_value' => 'false',
                'description' => 'Toggles global maintenance mode. If "true", users see the maintenance page.',
            ],
            [
                'setting_key' => 'google_analytics_id',
                'setting_value' => 'UA-XXXXXXX-X',
                'description' => 'Google Analytics Tracking ID (e.g. G-XXXXXXXXXX).',
            ],
            [
                'setting_key' => 'google_search_console_tag',
                'setting_value' => '',
                'description' => 'HTML tag for Google Search Console verification.',
            ],
            [
                'setting_key' => 'default_seo_description',
                'setting_value' => 'Optimize your resume for ATS systems with AI. Land more interviews with high-fidelity resume building and keyword optimization.',
                'description' => 'The default meta description used across the site.',
            ],
            [
                'setting_key' => 'seo_indexing',
                'setting_value' => 'true',
                'description' => 'Global toggle for search engine indexing (true/false).',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }
    }
}
