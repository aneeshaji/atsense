<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->string('job_title')->nullable()->after('source');
            $table->text('job_description')->nullable()->after('job_title');
        });
    }

    public function down(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->dropColumn(['job_title', 'job_description']);
        });
    }
};
