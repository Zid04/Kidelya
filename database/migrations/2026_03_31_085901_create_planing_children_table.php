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
        Schema::create('planing_children', function (Blueprint $table) {
              $table->id('IdPlaningChildren');
            $table->foreignId('IdPlaning')
                  ->constrained('planing', 'IdPlaning')
                  ->onDelete('cascade');
            $table->foreignId('IdChildren')
                  ->constrained('children', 'IdChildren')
                  ->onDelete('cascade');
            $table->timestamps();
            //Empêche un doublon (même enfant dans le même planning)
            $table->unique(['IdPlaning', 'IdChildren']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planing_children');
    }
};
