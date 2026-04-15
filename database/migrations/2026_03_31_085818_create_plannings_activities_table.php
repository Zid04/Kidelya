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
        Schema::create('plannings_activities', function (Blueprint $table) {
            $table->id('IdPlanningActivities'); 
            $table->date('DateStart'); 
            $table->date('DateEnd');   
            $table->foreignId('IdPlanning')
                  ->constrained('plannings', 'IdPlanning')
                  ->onDelete('cascade');
            $table->foreignId('IdActivities')
                  ->constrained('activities', 'IdActivities')
                  ->onDelete('cascade');
            $table->timestamps();
            // Empêche un doublon (même activité dans le même planning)
            $table->unique(['IdPlanning', 'IdActivities']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannings_activities');
    }
};
