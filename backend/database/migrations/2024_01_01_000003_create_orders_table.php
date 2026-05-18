<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('student_id');
            $table->uuid('restaurant_id');
            $table->string('restaurant_name');
            $table->uuid('delivery_person_id')->nullable();
            $table->json('items');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'])->default('pending');
            $table->string('delivery_address');
            $table->text('cancel_reason')->nullable();
            $table->string('cancelled_by')->nullable();
            $table->timestamps();
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('restaurant_id')->references('id')->on('restaurants')->onDelete('cascade');
            $table->foreign('delivery_person_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['student_id', 'created_at']);
            $table->index(['restaurant_id', 'status']);
            $table->index(['delivery_person_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
