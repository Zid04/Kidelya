<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packs_user', function (Blueprint $table) {
            $table->date('subscriptiondate')->nullable()->change();
            $table->date('expirationdate')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('packs_user', function (Blueprint $table) {
            $table->date('subscriptiondate')->nullable(false)->change();
            $table->date('expirationdate')->nullable(false)->change();
        });
    }
};
