<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Remove legacy/test users
        User::where('email', 'admin@atsense.in')->delete();
        User::where('email', 'test@example.com')->delete();

        User::updateOrCreate(
            ['email' => 'admin@atsense.online'],
            [
                'name' => 'ATSense Admin',
                'password' => Hash::make('ATsense@Admin#2026'),
                'is_admin' => true,
            ]
        );
    }
}
