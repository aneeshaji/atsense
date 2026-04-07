<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // General API Rate Limiter
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(100)->by($request->user()?->id ?: $request->ip());
        });

        // AI Service Rate Limiter (Increased for Interview Simulations to avoid drop-offs)
        \Illuminate\Support\Facades\RateLimiter::for('ai', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinutes(10, 30)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'message' => 'AI Career Coach is taking a quick breath. Please wait 1-2 minutes or try your next response shortly.',
                ], 429);
            });
        });

    }
}
