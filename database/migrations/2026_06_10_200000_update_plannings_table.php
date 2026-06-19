<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plannings', function (Blueprint $table) {
            // Colonnes requises par l'interface planning
            if (! Schema::hasColumn('plannings', 'date')) {
                $table->date('date')->nullable()->after('title');
            }
            if (! Schema::hasColumn('plannings', 'start_time')) {
                $table->string('start_time', 10)->nullable()->after('date');
            }
            if (! Schema::hasColumn('plannings', 'end_time')) {
                $table->string('end_time', 10)->nullable()->after('start_time');
            }

            // Rendre location et idreport optionnels
            $table->string('location', 100)->nullable()->change();
            $table->unsignedBigInteger('idreport')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('plannings', function (Blueprint $table) {
            $table->dropColumn(['date', 'start_time', 'end_time']);
            $table->string('location', 100)->nullable(false)->change();
            $table->unsignedBigInteger('idreport')->nullable(false)->change();
        });
    }
};
