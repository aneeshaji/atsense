<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Allow duplicate leads with the same email by dropping the unique index
     * added in 2026_03_27_164138_make_lead_email_unique.php.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            $uniqueIndexes = DB::select("SHOW INDEX FROM resume_leads WHERE Column_name = 'email' AND Non_unique = 0");
            if (!empty($uniqueIndexes)) {
                Schema::table('resume_leads', function (Blueprint $table) use ($uniqueIndexes) {
                    foreach ($uniqueIndexes as $idx) {
                        $table->dropUnique($idx->Key_name);
                    }
                });
            }

            $anyIndex = DB::select("SHOW INDEX FROM resume_leads WHERE Column_name = 'email'");
            if (empty($anyIndex)) {
                Schema::table('resume_leads', function (Blueprint $table) {
                    $table->index('email');
                });
            }
        } else {
            try {
                Schema::table('resume_leads', function (Blueprint $table) {
                    $table->dropUnique(['email']);
                });
            } catch (\Throwable $e) {
                // Index may not exist
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left non-unique so existing duplicate leads are not broken
    }
};
