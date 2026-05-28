<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->id('idsubscription');

            $table->foreignId('iduser')
                ->constrained('users', 'iduser')
                ->onDelete('cascade');

            $table->foreignId('idplan')
                ->constrained('subscription_plans', 'idplan')
                ->onDelete('cascade');

            $table->dateTime('starts_at');
            $table->dateTime('ends_at');

            $table->enum('status', ['active', 'expired', 'canceled'])
                ->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_subscriptions');
    }
};
