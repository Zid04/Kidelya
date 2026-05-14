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
        Schema::create('packs_user', function (Blueprint $table) {
    $table->id('idpackuser');

    $table->foreignId('idpack')
          ->constrained('packs', 'idpack')
          ->onDelete('cascade');

    $table->foreignId('iduser')
          ->constrained('users', 'iduser')
          ->onDelete('cascade');

    $table->date('subscriptiondate');
    $table->date('expirationdate');

    $table->enum('status', ['active', 'inactive', 'canceled'])
          ->default('inactive');

    $table->timestamps();
});

    }
       

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs_user');
    }
};
