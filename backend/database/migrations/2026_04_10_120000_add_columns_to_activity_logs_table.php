<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The initial stub migration (075058) created activity_logs with only id + timestamps.
 * This migration adds all required columns to the existing table.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // Only add columns that don't already exist (safe re-run)
            if (!Schema::hasColumn('activity_logs', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('activity_logs', 'level')) {
                $table->string('level')->default('info')->after('user_id');
            }
            if (!Schema::hasColumn('activity_logs', 'action')) {
                $table->string('action')->after('level');
            }
            if (!Schema::hasColumn('activity_logs', 'message')) {
                $table->text('message')->after('action');
            }
            if (!Schema::hasColumn('activity_logs', 'metadata')) {
                $table->json('metadata')->nullable()->after('message');
            }
            if (!Schema::hasColumn('activity_logs', 'ip_address')) {
                $table->string('ip_address')->nullable()->after('metadata');
            }
            if (!Schema::hasColumn('activity_logs', 'user_agent')) {
                $table->string('user_agent')->nullable()->after('ip_address');
            }
        });

        // Add indexes if they don't already exist
        Schema::table('activity_logs', function (Blueprint $table) {
            try { $table->index('level'); } catch (\Exception $e) {}
            try { $table->index('action'); } catch (\Exception $e) {}
            try { $table->index('user_id'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'level', 'action', 'message', 'metadata', 'ip_address', 'user_agent']);
        });
    }
};
