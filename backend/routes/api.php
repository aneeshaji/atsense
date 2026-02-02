<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\CoverLetterController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\ExportController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password/{token}', [AuthController::class, 'resetPassword']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    
    // Resume routes
    Route::post('/resumes/import', [ResumeController::class, 'importResume']);
    Route::get('/resumes/{id}/ats-breakdown', [ResumeController::class, 'getATSBreakdown']);
    Route::get('/preview/{id}', [ResumeController::class, 'preview']);
    Route::apiResource('resumes', ResumeController::class);
    
    // Cover letter routes
    Route::apiResource('cover-letters', CoverLetterController::class);
    
    // AI routes
    Route::post('/ai/generate', [AIController::class, 'generateResume']);
    Route::post('/ai/match', [AIController::class, 'analyzeJobMatch']);
    Route::post('/ai/linkedin-optimize', [AIController::class, 'optimizeLinkedIn']);
    
    // Export routes
    Route::get('/export/pdf/{id}', [ExportController::class, 'pdf']);
    Route::get('/export/docx/{id}', [ExportController::class, 'docx']);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'ATSense Laravel API running',
    ]);
});

