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
      Schema::create('packs_activities', function (Blueprint $table) {
    $table->id('idpackactivities');

    $table->foreignId('idpack')
          ->constrained('packs', 'idpack')
          ->onDelete('cascade');

    $table->foreignId('idactivities')
          ->constrained('activities', 'idactivities')
          ->onDelete('cascade');

    $table->timestamps();

    // Empêche un doublon (même activité dans le même pack)
    $table->unique(['idpack', 'idactivities']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs_activities');
    }
};
