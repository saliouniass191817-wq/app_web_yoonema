<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_code', 12)->nullable()->after('delivery_person_id');
            $table->timestamp('ready_at')->nullable()->after('paid_at');
            $table->index('delivery_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['delivery_code']);
            $table->dropColumn(['delivery_code', 'ready_at']);
        });
    }
};
