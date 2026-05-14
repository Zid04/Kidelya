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
        Schema::create('plannings_groups', function (Blueprint $table) {
    $table->id('idplanninggroup');

    $table->foreignId('idplanning')
          ->constrained('plannings', 'idplanning')
          ->onDelete('cascade');

    $table->foreignId('idgroup')
          ->constrained('groups', 'idgroup')
          ->onDelete('cascade');

    $table->timestamps();

    $table->unique(['idplanning', 'idgroup']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannings_groups');
    }
};
