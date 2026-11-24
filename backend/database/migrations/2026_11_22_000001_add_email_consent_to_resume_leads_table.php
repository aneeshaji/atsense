<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->boolean('email_consent')->default(false)->after('status');
            $table->timestamp('welcome_email_sent_at')->nullable()->after('email_consent');
            $table->timestamp('drip_day2_sent_at')->nullable()->after('welcome_email_sent_at');
            $table->timestamp('drip_day5_sent_at')->nullable()->after('drip_day2_sent_at');
            $table->timestamp('drip_day7_sent_at')->nullable()->after('drip_day5_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('resume_leads', function (Blueprint $table) {
            $table->dropColumn([
                'email_consent', 
                'welcome_email_sent_at',
                'drip_day2_sent_at',
                'drip_day5_sent_at',
                'drip_day7_sent_at'
            ]);
        });
    }
};
