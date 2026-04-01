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
        Schema::create('planing_group', function (Blueprint $table) {
            $table->id('IdPlaningGroup');
            $table->foreignId('IdPlaning')
                  ->constrained('planing', 'IdPlaning')
                  ->onDelete('cascade');
            $table->foreignId('IdGroup')
                  ->constrained('group', 'IdGroup')
                  ->onDelete('cascade');
            $table->timestamps();
            //Empêche un doublon (même groupe dans le même planning)
            $table->unique(['IdPlaning', 'IdGroup']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planing_group');
    }
};
