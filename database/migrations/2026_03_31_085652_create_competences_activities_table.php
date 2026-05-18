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
      Schema::create('competences_activities', function (Blueprint $table) {
    $table->id('idcompetenceactivities'); 

    $table->foreignId('idcompetence')
          ->constrained('competences', 'idcompetence')
          ->onDelete('cascade');

    $table->foreignId('idactivities')
          ->constrained('activities', 'idactivities')
          ->onDelete('cascade');

    $table->timestamps();

    // Empêche une compétence d'être associée 2 fois à la même activité
    $table->unique(['idcompetence', 'idactivities']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competences_activities');
    }
};
