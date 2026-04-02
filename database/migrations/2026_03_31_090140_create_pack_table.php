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
        Schema::create('pack', function (Blueprint $table) {
             $table->id('IdPack'); 
             $table->string('Title', 50);
             $table->float('Tarification', 15, 2);
             $table->integer('Duration');
             $table->text('Description')->nullable();
             $table->foreignId('CreatedBy')->constrained('users', 'IdUser')->onDelete('cascade');
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pack');
    }
};
