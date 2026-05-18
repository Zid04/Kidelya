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
        Schema::create('plannings', function (Blueprint $table) {
    $table->id('idplanning'); 
    $table->string('title', 50); 
    $table->text('description')->nullable(); 
    $table->string('location', 100);

    $table->foreignId('iduser')
          ->constrained('users', 'iduser')
          ->onDelete('cascade');

    $table->foreignId('idreport')
          ->constrained('report_activities', 'idreport')
          ->onDelete('cascade');

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plannings');
    }
};
