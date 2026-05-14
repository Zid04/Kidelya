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
        Schema::create('children_parents', function (Blueprint $table) {
    $table->id('idchildrenparent');

    $table->foreignId('idchildren')
          ->constrained('children', 'idchildren')
          ->onDelete('cascade');

    $table->foreignId('idparent')
          ->constrained('parents', 'idparent')
          ->onDelete('cascade');

    $table->timestamps();

    // Empêche un doublon (même parent pour le même enfant)
    $table->unique(['idchildren', 'idparent']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children_parents');
    }
};
