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
        Schema::create('planing_activities', function (Blueprint $table) {
            $table->id('IdPlaningActivities'); 

            $table->foreignId('IdPlaning')
                  ->constrained('planing', 'IdPlaning')
                  ->onDelete('cascade');
            $table->foreignId('IdActivities')
                  ->constrained('activities', 'IdActivities')
                  ->onDelete('cascade');
            $table->timestamps();
            // Empêche un doublon (même activité dans le même planning)
            $table->unique(['IdPlaning', 'IdActivities']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planing_activities');
    }
};
