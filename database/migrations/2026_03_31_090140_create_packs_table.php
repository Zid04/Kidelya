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
        Schema::create('packs', function (Blueprint $table) {
    $table->id('idpack'); 
    $table->string('title', 50);
    $table->float('tarification', 15, 2);
    $table->integer('duration');
    $table->text('description')->nullable();
 $table->boolean('is_published')->default(false); 
    $table->string('type', 50)->default('subscription'); 
    $table->foreignId('createdby')
          ->constrained('users', 'iduser')
          ->onDelete('cascade');

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs');
    }
};
