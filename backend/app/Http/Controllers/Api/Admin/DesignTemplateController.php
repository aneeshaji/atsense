<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\DesignTemplate;

class DesignTemplateController extends Controller
{
    // Admin: List all templates
    public function index()
    {
        return response()->json(DesignTemplate::orderBy('sort_order', 'asc')->get());
    }

    // Admin: Create template config (Advanced)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:design_templates',
            'component_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'preview_image' => 'nullable|string' // A hash or path to public storage
        ]);

        $template = DesignTemplate::create($validated);
        return response()->json($template, 201);
    }

    // Admin: Get specific template details
    public function show($id)
    {
        return response()->json(DesignTemplate::findOrFail($id));
    }

    // Admin: Update template
    public function update(Request $request, $id)
    {
        $template = DesignTemplate::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:design_templates,slug,' . $id,
            'component_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'preview_image' => 'nullable|string'
        ]);

        $template->update($validated);
        return response()->json($template);
    }

    // Admin: Toggle active status quickly
    public function toggleActive($id)
    {
        $template = DesignTemplate::findOrFail($id);
        $template->update(['is_active' => !$template->is_active]);
        return response()->json(['message' => 'Status updated.', 'is_active' => $template->is_active]);
    }

    // Admin: Delete template
    public function destroy($id)
    {
        DesignTemplate::destroy($id);
        return response()->json(['message' => 'Template deleted successfully.']);
    }

    // Public: Get only active templates for the builder and gallery
    public function indexPublic()
    {
        return response()->json(DesignTemplate::where('is_active', true)->orderBy('sort_order', 'asc')->get());
    }
}
