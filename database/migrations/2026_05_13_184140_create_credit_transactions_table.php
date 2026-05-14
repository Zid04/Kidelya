<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id('idcredittransaction');

            $table->foreignId('user_id')
                  ->constrained('users', 'iduser')
                  ->onDelete('cascade');

            $table->integer('amount');
            $table->enum('type', ['achat', 'conso','remboursement', 'bonus']); 

            $table->foreignId('activity_id')
                  ->nullable()
                  ->constrained('activities', 'idactivities')
                  ->onDelete('set null');

            $table->string('ref_stripe', 255)->nullable(); // référence Stripe

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};
