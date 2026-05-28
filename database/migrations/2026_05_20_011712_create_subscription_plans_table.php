<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id('idplan');
            $table->string('name'); // Free, Monthly, Annual
            $table->decimal('price', 8, 2)->default(0);
            $table->enum('interval', ['none', 'month', 'year'])->default('none');
            $table->integer('interval_count')->default(0);

            $table->boolean('has_all_packs')->default(false);
            $table->boolean('has_planning')->default(false);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
