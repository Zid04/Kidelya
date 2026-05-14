<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_stats', function (Blueprint $table) {
            $table->id('idstat');

            $table->date('date')->unique(); 

            $table->integer('total_active')->default(0);
            $table->integer('total_expired')->default(0);
            $table->integer('new_subscriptions')->default(0);
            $table->integer('churned')->default(0);

            $table->decimal('revenue', 15, 2)->default(0); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_stats');
    }
};
