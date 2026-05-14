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
       Schema::create('groups_children', function (Blueprint $table) {
    $table->id('idgroupchildren');

    $table->foreignId('idgroup')
          ->constrained('groups', 'idgroup')
          ->onDelete('cascade');

    $table->foreignId('idchildren')
          ->constrained('children', 'idchildren')
          ->onDelete('cascade');

    // Empêcher les doublons
    $table->unique(['idgroup', 'idchildren']);

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups_children');
    }
};
