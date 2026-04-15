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
            $table->id('IdPlanningGroup');
            $table->foreignId('IdPlanning')
                  ->constrained('plannings', 'IdPlanning')
                  ->onDelete('cascade');
            $table->foreignId('IdGroup')
                  ->constrained('groups', 'IdGroup')
                  ->onDelete('cascade');
            $table->timestamps();
            //Empêche un doublon (même groupe dans le même planning)
            $table->unique(['IdPlanning', 'IdGroup']);
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
