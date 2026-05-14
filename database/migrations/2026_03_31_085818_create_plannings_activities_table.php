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
        Schema::create('plannings_activities', function (Blueprint $table) {
    $table->id('idplanningactivities'); 
    $table->date('datestart'); 
    $table->date('dateend');   

    $table->foreignId('idplanning')
          ->constrained('plannings', 'idplanning')
          ->onDelete('cascade');

    $table->foreignId('idactivities')
          ->constrained('activities', 'idactivities')
          ->onDelete('cascade');

    $table->timestamps();

    $table->unique(['idplanning', 'idactivities']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannings_activities');
    }
};
