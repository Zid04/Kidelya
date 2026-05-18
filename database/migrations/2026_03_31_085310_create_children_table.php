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
    {Schema::create('children', function (Blueprint $table) {
    $table->id('idchildren');
    $table->string('lastname', 50);
    $table->string('firstname', 50);
    $table->date('birthday');
    $table->text('specification_note')->nullable();
    $table->enum('sexe', ['male','female','other']);
    $table->string('photourl', 255)->nullable();
    $table->foreignId('iduser')->constrained('users', 'iduser')->onDelete('cascade');
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
