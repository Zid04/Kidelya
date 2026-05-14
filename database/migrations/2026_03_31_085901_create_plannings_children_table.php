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
        Schema::create('plannings_children', function (Blueprint $table) {
    $table->id('idplanningchildren');

    $table->foreignId('idplanning')
          ->constrained('plannings', 'idplanning')
          ->onDelete('cascade');

    $table->foreignId('idchildren')
          ->constrained('children', 'idchildren')
          ->onDelete('cascade');

    $table->timestamps();

    $table->unique(['idplanning', 'idchildren']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannings_children');
    }
};
