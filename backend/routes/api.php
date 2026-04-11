<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\CoverLetterController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\DesignTemplateController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\SitemapController;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// Authentication requirements removed

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    Route::get('/admin/leads', [AdminController::class, 'getLeads']);
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::put('/admin/leads/{id}', [AdminController::class, 'updateLead']);
    Route::delete('/admin/leads/{id}', [AdminController::class, 'deleteLead']);
    Route::post('/admin/leads/{id}/email', [AdminController::class, 'sendEmail']);
    Route::post('/admin/change-password', [AdminController::class, 'changePassword']);

    // Admin CMS Expansion
    Route::post('admin/posts/generate', [PostController::class, 'generatePost']);
    Route::apiResource('admin/posts', PostController::class);
    Route::apiResource('admin/templates', DesignTemplateController::class);
    Route::post('admin/templates/{template}/toggle', [DesignTemplateController::class, 'toggleActive']);
    Route::apiResource('admin/settings', SiteSettingController::class)->except(['destroy']);

    // Activity Logs
    Route::get('admin/activity-logs', [ActivityLogController::class, 'index']);
    Route::delete('admin/activity-logs', [ActivityLogController::class, 'purge']);
});

// Public Endpoints for CMS
Route::get('/posts', [PostController::class, 'indexPublic']);
Route::get('/posts/{slug}', [PostController::class, 'showPublic']);
Route::get('/templates', [DesignTemplateController::class, 'indexPublic']);
Route::get('/settings', [SiteSettingController::class, 'indexPublic']);

// PDF preview served outside sanctum (iframes can't send headers) — uses query token
Route::get('/admin/leads/{id}/pdf', [AdminController::class, 'previewPdf']);


// Stateless AI endpoints
Route::middleware(['throttle:ai'])->group(function () {
    Route::post('/analyze-ats', [ResumeController::class, 'analyzeBreakdownOffline']);
    Route::post('/optimize-resume', [AIController::class, 'optimizeResumeOffline']);
    Route::post('/generate-summary', [AIController::class, 'generateSummaryOffline']);
    Route::post('/ai/match', [AIController::class, 'matchResumeOffline']);
    Route::post('/ai/cover-letter', [AIController::class, 'generateCoverLetterOffline']);
    Route::post('/ai/linkedin-optimize', [AIController::class, 'optimizeLinkedInOffline']);
    Route::post('/ai/interview/questions', [InterviewController::class, 'generateQuestions']);
    Route::post('/ai/interview/evaluate', [InterviewController::class, 'evaluateAnswer']);
    Route::post('/ai/jobs/extract', [AIController::class, 'extractJobOffline']);
});

Route::post('/import', [ResumeController::class, 'importOffline']);
Route::post('/export/pdf', [ExportController::class, 'exportPdfOffline']);
Route::post('/preview', [ExportController::class, 'previewHtml']);

Route::post('/leads/capture', [LeadController::class, 'capture']);
Route::post('/leads/update', [LeadController::class, 'update']);
Route::post('/leads/snapshot', [ExportController::class, 'snapshot']);

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'ATSense Laravel API running',
    ]);
});