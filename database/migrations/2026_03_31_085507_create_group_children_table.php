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
        Schema::create('group_children', function (Blueprint $table) {
            $table->id('IdGroupChildren');
            $table->foreignId('IdGroup')
                  ->constrained('group', 'IdGroup')
                  ->onDelete('cascade');
            $table->foreignId('IdChildren')
                  ->constrained('children', 'IdChildren')
                  ->onDelete('cascade');
            // Empêcher les doublons (un enfant ne peut pas être ajouté 2 fois au même groupe)
            $table->unique(['IdGroup', 'IdChildren']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_children');
    }
};
