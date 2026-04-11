<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Post;

class PostController extends Controller
{
    // Admin: List all posts
    public function index()
    {
        return response()->json(Post::orderBy('created_at', 'desc')->paginate(15));
    }

    // AI: Generate Post
    public function generatePost(Request $request, \App\Services\AIService $aiService)
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:500'
        ]);

        try {
            $data = $aiService->generateBlogPost($validated['topic']);
            return response()->json($data);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('AI Blog Gen Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate post. ' . $e->getMessage()], 500);
        }
    }

    // Admin: Create new post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        // Automatically assign admin user as author if available
        $validated['author_id'] = $request->user() ? $request->user()->id : null;

        $post = Post::create($validated);
        return response()->json($post, 201);
    }

    // Admin: Get a specific post for editing
    public function show($id)
    {
        return response()->json(Post::findOrFail($id));
    }

    // Admin: Update post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug,' . $id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        $post->update($validated);
        return response()->json($post);
    }

    // Admin: Delete post
    public function destroy($id)
    {
        Post::destroy($id);
        return response()->json(['message' => 'Post deleted successfully.']);
    }

    // Public: List only published posts
    public function indexPublic()
    {
        return response()->json(Post::where('is_published', true)->orderBy('created_at', 'desc')->get());
    }

    // Public: View single published post by slug
    public function showPublic($slug)
    {
        return response()->json(Post::where('slug', $slug)->where('is_published', true)->firstOrFail());
    }
}
