
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('themes_activities', function (Blueprint $table) {
            $table->id('idThemeActivities');

            $table->foreignId('IdTheme')
                  ->constrained('themes', 'IdTheme')
                  ->onDelete('cascade');

            $table->foreignId('IdActivities')
                  ->constrained('activities', 'IdActivities')
                  ->onDelete('cascade');

            $table->timestamps();

            $table->unique(['IdTheme', 'IdActivities']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes_activities');
    }
};
