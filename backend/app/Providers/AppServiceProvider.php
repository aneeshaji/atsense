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

        // AI Service Rate Limiter (Limit to 10 jobs per 10 minutes to prevent continuous abuse)
        \Illuminate\Support\Facades\RateLimiter::for('ai', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinutes(10, 10)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'message' => 'AI Service speed limit reached. Please wait a few minutes before your next generation.',
                ], 429);
            });
        });
    }
}
