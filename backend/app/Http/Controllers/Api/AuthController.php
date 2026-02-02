<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 400);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
        ]);
    }

    /**
     * Forgot password - send reset link
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        // Generate reset token
        $resetToken = Str::random(64);

        // Hash and save token
        $user->reset_password_token = hash('sha256', $resetToken);
        $user->reset_password_expires = now()->addHour();
        $user->save();

        // Create reset URL
        $frontendUrl = env('CLIENT_URL', 'http://localhost:3000');
        $resetUrl = "{$frontendUrl}/reset-password/{$resetToken}";

        // TODO: Send email with reset link
        // For now, just return success (email service needs to be implemented)
        
        return response()->json([
            'message' => 'Email sent',
            'reset_url' => $resetUrl, // Remove this in production
        ]);
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        // Hash the token to match stored hash
        $hashedToken = hash('sha256', $token);

        $user = User::where('reset_password_token', $hashedToken)
            ->where('reset_password_expires', '>', now())
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid or expired token',
            ], 400);
        }

        // Update password and clear reset fields
        $user->password = Hash::make($request->password);
        $user->reset_password_token = null;
        $user->reset_password_expires = null;
        $user->save();

        // Generate new auth token
        $authToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Password reset successful',
            'token' => $authToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
