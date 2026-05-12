<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('owner_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('image_url')->nullable();
            $table->string('cover_url')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->boolean('is_open')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->integer('delivery_time')->default(30);
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->json('opening_hours')->nullable();
            $table->timestamps();
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('is_approved');
            $table->index('is_open');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('restaurant_id')->references('id')->on('restaurants')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
        });

        Schema::dropIfExists('restaurants');
    }
};
