<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_payouts', function (Blueprint $table) {
            $table->id();
            $table->uuid('vendor_id');
            $table->decimal('amount', 10, 2);
            $table->unsignedInteger('orders_count');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->date('period_start');
            $table->date('period_end');
            $table->string('payout_method')->default('wave');
            $table->string('payout_reference')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            $table->foreign('vendor_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['vendor_id', 'status']);
            $table->index(['period_start', 'period_end']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_payouts');
    }
};
