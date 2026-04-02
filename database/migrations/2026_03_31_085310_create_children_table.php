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
        Schema::create('children', function (Blueprint $table) {
             $table->id('IdChildren');
             $table->string('LastName', 50);
             $table->string('FirstName', 50);
             $table->date('BirthDay');
             $table->text('SpecificationNote')->nullable();
             $table->enum('Sexe', ['Male','Female','Other']);
             $table->string('PhotoUrl', 255)->nullable();
             $table->foreignId('IdUser')->constrained('users', 'IdUser')->onDelete('cascade');
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
