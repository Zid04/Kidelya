<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_purchases', function (Blueprint $table) {
            $table->id('idactivitypurchase');

            $table->foreignId('user_id')
                  ->constrained('users', 'iduser')
                  ->onDelete('cascade');

            $table->foreignId('activity_id')
                  ->constrained('activities', 'idactivities')
                  ->onDelete('cascade');

            $table->integer('credits_spent'); 

            $table->timestamp('purchased_at')->useCurrent();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_purchases');
    }
};
