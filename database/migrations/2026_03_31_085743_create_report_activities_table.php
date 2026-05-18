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
    $table->id('idreport');
    $table->text('comments')->nullable();
    $table->string('photourl', 255)->nullable();
    $table->text('improvements')->nullable();
    $table->text('positive')->nullable();
    $table->text('difficulties')->nullable();
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
