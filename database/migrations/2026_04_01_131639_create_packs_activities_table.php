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
      Schema::create('packs_activities', function (Blueprint $table) {
            $table->id('IdPackActivities');

            $table->foreignId('IdPack')
                  ->constrained('packs', 'IdPack')
                  ->onDelete('cascade');

            $table->foreignId('IdActivities')
                  ->constrained('activities', 'IdActivities')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs_activities');
    }
};
