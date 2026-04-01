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
             $table->id('IdActivities'); 
             $table->string('Title', 50);
             $table->text('Description')->nullable();
             $table->integer('AgeMin')->nullable();
             $table->integer('AgeMax')->nullable();
             $table->integer('Duration')->nullable(); 
             $table->string('Season', 50)->nullable();
             $table->string('Location', 100)->nullable();
             $table->string('PhotoUrl', 255)->nullable();
             $table->foreignId('IdUser')
                  ->constrained('users', 'IdUser')
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
