<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiteSetting;

class SiteSettingController extends Controller
{
    // Admin: List all settings
    public function index()
    {
        return response()->json(SiteSetting::all());
    }

    // Admin: Create or update settings dynamically
    public function store(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.setting_key' => 'required|string',
            'settings.*.setting_value' => 'nullable|string',
            'settings.*.description' => 'nullable|string',
            'settings.*.type' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            SiteSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                [
                    'setting_value' => $setting['setting_value'] ?? null,
                    'description' => $setting['description'] ?? null,
                    'type' => $setting['type'] ?? 'string',
                ]
            );
        }

        return response()->json(['message' => 'Settings saved successfully.']);
    }

    public function show($id)
    {
        return response()->json(SiteSetting::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $setting = SiteSetting::findOrFail($id);
        $validated = $request->validate([
            'setting_key' => 'required|string|unique:site_settings,setting_key,' . $id,
            'setting_value' => 'nullable|string',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
        ]);

        $setting->update($validated);
        return response()->json($setting);
    }

    // Public: Retrieve settings mapped as Key => Value object for lightweight ingestion
    public function indexPublic()
    {
        $settings = SiteSetting::all()->pluck('setting_value', 'setting_key');
        return response()->json($settings);
    }
}
