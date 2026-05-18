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
       Schema::create('activities', function (Blueprint $table) {
    $table->id('idactivities'); 
    $table->string('title', 50);
    $table->text('description')->nullable();
    $table->integer('agemin')->nullable();
    $table->integer('agemax')->nullable();
    $table->integer('duration')->nullable(); 
    $table->string('season', 50)->nullable();
    $table->string('location', 100)->nullable();
    $table->string('photourl', 255)->nullable();
  $table->integer('credit_price')->nullable();      
    $table->boolean('is_purchasable')->default(false); 
    $table->boolean('is_published')->default(true);    
    $table->foreignId('iduser')
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
        Schema::dropIfExists('activities');
    }
};
