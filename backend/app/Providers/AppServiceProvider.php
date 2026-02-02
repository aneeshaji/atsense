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
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Support\Facades\RateLimiter::limit(5)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'message' => 'Will introduce pro plans soon',
                ], 429);
            });
        });
    }
}
