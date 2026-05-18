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
            if (! $this->indexExists('orders', 'orders_student_id_status_index')) {
                $table->index(['student_id', 'status']);
            }

            if (! $this->indexExists('orders', 'orders_expires_at_index')) {
                $table->index('expires_at');
            }

            if (! $this->indexExists('orders', 'orders_payment_status_index')) {
                $table->index('payment_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['student_id', 'status']);
            $table->dropIndex(['expires_at']);
            $table->dropIndex(['payment_status']);
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        if (DB::getDriverName() === 'sqlite') {
            $indexes = DB::select("PRAGMA index_list('{$table}')");
            foreach ($indexes as $idx) {
                if ($idx->name === $index) {
                    return true;
                }
            }
            return false;
        }

        $database = DB::getDatabaseName();

        return collect(DB::select(
            'SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1',
            [$database, $table, $index]
        ))->isNotEmpty();
    }
};
