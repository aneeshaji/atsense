<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->longText('resume_data')->nullable()->after('skills');
        });
    }

    public function down(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->dropColumn('resume_data');
        });
    }
};
