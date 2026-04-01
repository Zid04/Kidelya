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
        Schema::create('planing', function (Blueprint $table) {
            $table->id('IdPlaning'); 
            $table->string('Title', 50); 
            $table->text('Description')->nullable(); 
            $table->date('DateStart'); 
            $table->date('DateEnd');   
             $table->string('location', 100);
            $table->foreignId('IdUser')
                  ->constrained('users', 'IdUser')
                  ->onDelete('cascade');
            $table->foreignId('IdReport')
                  ->constrained('report_activities', 'IdReport')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planing');
    }
};
