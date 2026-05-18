<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('refused_reason')->nullable()->after('delivery_address');
            $table->string('cancelled_reason')->nullable()->after('refused_reason');
            $table->timestamp('expires_at')->nullable()->after('cancelled_by');
        });

        DB::statement("UPDATE orders SET status = 'confirmed' WHERE status IN ('preparing', 'ready')");
        
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','confirmed','delivering','delivered','refused','cancelled','expired') NOT NULL DEFAULT 'pending'");
            DB::statement("ALTER TABLE orders MODIFY cancelled_by ENUM('student','vendor','system') NULL");
            DB::statement('UPDATE orders SET expires_at = DATE_ADD(created_at, INTERVAL '.((int) config('yoonema.order_expiry_minutes', 15)).' MINUTE) WHERE expires_at IS NULL');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','confirmed','preparing','ready','delivering','delivered','cancelled') NOT NULL DEFAULT 'pending'");
            DB::statement('ALTER TABLE orders MODIFY cancelled_by VARCHAR(255) NULL');
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['refused_reason', 'cancelled_reason', 'expires_at']);
        });
    }
};
