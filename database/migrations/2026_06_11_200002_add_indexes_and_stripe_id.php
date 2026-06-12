<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Index FK iduser sur activities (queries by creator)
        Schema::table('activities', function (Blueprint $table) {
            $table->index('iduser', 'activities_iduser_index');
        });

        // stripe_subscription_id sur user_subscriptions
        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->string('stripe_subscription_id')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex('activities_iduser_index');
        });

        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->dropColumn('stripe_subscription_id');
        });
    }
};
