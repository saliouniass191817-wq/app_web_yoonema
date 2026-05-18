<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use App\Services\OrderPricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class OrderPricingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_recalculates_prices_from_menu_items(): void
    {
        $vendor = User::query()->create([
            'id' => (string) Str::uuid(),
            'name' => 'Vendor',
            'email' => 'vendor@test.com',
            'phone' => '771234567',
            'role' => 'vendor',
            'password' => bcrypt('password'),
        ]);

        $restaurant = Restaurant::query()->create([
            'id' => (string) Str::uuid(),
            'owner_id' => $vendor->id,
            'name' => 'Test Resto',
            'address' => 'Dakar',
            'is_open' => true,
            'is_approved' => true,
        ]);

        $item = MenuItem::query()->create([
            'id' => (string) Str::uuid(),
            'restaurant_id' => $restaurant->id,
            'name' => 'Thieb',
            'price' => 1500,
            'is_available' => true,
        ]);

        $pricing = app(OrderPricingService::class)->buildValidatedPayload($restaurant, [
            ['id' => $item->id, 'name' => 'Fake', 'price' => 1, 'quantity' => 2],
        ]);

        $this->assertSame(3000.0, $pricing['total_amount']);
        $this->assertSame(1500.0, $pricing['items'][0]['price']);
    }

    public function test_it_rejects_unavailable_items(): void
    {
        $this->expectException(ValidationException::class);

        $vendor = User::query()->create([
            'id' => (string) Str::uuid(),
            'name' => 'Vendor',
            'email' => 'vendor2@test.com',
            'phone' => '771234568',
            'role' => 'vendor',
            'password' => bcrypt('password'),
        ]);

        $restaurant = Restaurant::query()->create([
            'id' => (string) Str::uuid(),
            'owner_id' => $vendor->id,
            'name' => 'Test Resto',
            'address' => 'Dakar',
            'is_open' => true,
            'is_approved' => true,
        ]);

        $item = MenuItem::query()->create([
            'id' => (string) Str::uuid(),
            'restaurant_id' => $restaurant->id,
            'name' => 'Indisponible',
            'price' => 1000,
            'is_available' => false,
        ]);

        app(OrderPricingService::class)->buildValidatedPayload($restaurant, [
            ['id' => $item->id, 'quantity' => 1],
        ]);
    }
}
