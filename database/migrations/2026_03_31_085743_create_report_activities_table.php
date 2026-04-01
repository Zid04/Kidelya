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
        Schema::create('report_activities', function (Blueprint $table) {
             $table->id('IdReport');
             $table->text('Comments')->nullable();
             $table->string('PhotoUrl', 255)->nullable();
             $table->text('Improvements')->nullable();
             $table->text('Positive')->nullable();
             $table->text('Difficulties')->nullable();
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_activities');
    }
};
