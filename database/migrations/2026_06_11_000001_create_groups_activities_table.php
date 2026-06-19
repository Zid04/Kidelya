<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groups_activities', function (Blueprint $table) {
            $table->id('idgroupactivities');

            $table->foreignId('idgroup')
                ->constrained('groups', 'idgroup')
                ->onDelete('cascade');

            $table->foreignId('idactivities')
                ->constrained('activities', 'idactivities')
                ->onDelete('cascade');

            $table->unique(['idgroup', 'idactivities']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groups_activities');
    }
};
