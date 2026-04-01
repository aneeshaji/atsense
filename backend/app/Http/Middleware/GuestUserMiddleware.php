<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GuestUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Find or create a default guest user
        $guestUser = User::firstOrCreate(
            ['email' => 'guest@atsense.local'],
            [
                'name' => 'Guest User',
                'password' => bcrypt('guestpassword123'),
            ]
        );

        // Authenticate the user for this request
        Auth::login($guestUser);
        
        // Ensure $request->user() returns this guest user
        $request->setUserResolver(function () use ($guestUser) {
            return $guestUser;
        });

        return $next($request);
    }
}
