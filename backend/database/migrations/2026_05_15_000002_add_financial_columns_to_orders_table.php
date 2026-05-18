<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('delivery_fee');
            $table->decimal('platform_commission', 10, 2)->default(0)->after('subtotal');
            $table->decimal('vendor_amount', 10, 2)->default(0)->after('platform_commission');
            $table->decimal('delivery_fee_student', 10, 2)->default(0)->after('vendor_amount');
            $table->decimal('delivery_fee_platform', 10, 2)->default(0)->after('delivery_fee_student');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending')->after('delivery_fee_platform');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->string('payment_reference')->nullable()->after('payment_method');
            $table->timestamp('paid_at')->nullable()->after('payment_reference');
            $table->boolean('payout_processed')->default(false)->after('paid_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal',
                'platform_commission',
                'vendor_amount',
                'delivery_fee_student',
                'delivery_fee_platform',
                'payment_status',
                'payment_method',
                'payment_reference',
                'paid_at',
                'payout_processed',
            ]);
        });
    }
};
