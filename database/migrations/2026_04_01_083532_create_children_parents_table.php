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
        Schema::create('children_parents', function (Blueprint $table) {
            $table->id('IdChildrenParent');
            $table->foreignId('IdChildren')->constrained('children', 'IdChildren')->onDelete('cascade');
            $table->foreignId('IdParent')->constrained('parents', 'IdParent')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children_parents');
    }
};
