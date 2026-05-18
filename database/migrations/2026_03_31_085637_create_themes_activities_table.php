
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
    $table->id('idthemeactivities');

    $table->foreignId('idtheme')
          ->constrained('themes', 'idtheme')
          ->onDelete('cascade');

    $table->foreignId('idactivities')
          ->constrained('activities', 'idactivities')
          ->onDelete('cascade');

    $table->timestamps();

    $table->unique(['idtheme', 'idactivities']);
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
