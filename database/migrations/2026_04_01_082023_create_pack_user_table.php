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
        Schema::create('pack_user', function (Blueprint $table) {
            $table->id('IdPackUser');
            $table->foreignId('IdPack')
                  ->constrained('pack', 'IdPack')
                  ->onDelete('cascade');
            $table->foreignId('IdUser')
                  ->constrained('users', 'IdUser')
                    ->onDelete('cascade');
            $table->date('SubscriptionDate');
            $table->date('ExpirationDate');
            $table->enum('Status', ['active', 'inactive', 'canceled'])->default('inactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pack_user');
    }
};
