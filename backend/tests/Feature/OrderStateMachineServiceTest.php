<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Services\OrderStateMachineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class OrderStateMachineServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrder(array $overrides = [], bool $restaurantOpen = true): Order
    {
        $vendor = User::query()->create([
            'id' => (string) Str::uuid(),
            'name' => 'Vendor',
            'email' => 'v_'.Str::random(6).'@test.com',
            'role' => 'vendor',
            'password' => bcrypt('password'),
        ]);

        $student = User::query()->create([
            'id' => (string) Str::uuid(),
            'name' => 'Student',
            'email' => 's_'.Str::random(6).'@test.com',
            'role' => 'student',
            'password' => bcrypt('password'),
        ]);

        $restaurant = Restaurant::query()->create([
            'id' => (string) Str::uuid(),
            'owner_id' => $vendor->id,
            'name' => 'Resto',
            'address' => 'Dakar',
            'is_open' => $restaurantOpen,
            'is_approved' => true,
        ]);

        $createdAt = $overrides['created_at'] ?? null;
        unset($overrides['created_at']);

        $order = Order::query()->create(array_merge([
            'id' => (string) Str::uuid(),
            'student_id' => $student->id,
            'restaurant_id' => $restaurant->id,
            'restaurant_name' => $restaurant->name,
            'items' => [['id' => '1', 'name' => 'Plat', 'price' => 1000, 'quantity' => 1]],
            'total_amount' => 1000,
            'delivery_fee' => 200,
            'status' => 'pending',
            'payment_status' => 'pending',
            'delivery_address' => 'Campus',
            'expires_at' => now()->addMinutes(15),
        ], $overrides));

        // created_at is guarded (not fillable); force it for time-window tests.
        if ($createdAt !== null) {
            $order->forceFill(['created_at' => $createdAt])->save();
            $order->refresh();
        }

        return $order;
    }

    public function test_vendor_can_confirm_paid_order_when_restaurant_open(): void
    {
        $order = $this->makeOrder(['payment_status' => 'paid']);

        $result = app(OrderStateMachineService::class)
            ->transition($order, 'confirmed', $order->restaurant->owner, 'vendor');

        $this->assertSame('confirmed', $result->status);
    }

    public function test_vendor_cannot_confirm_unpaid_order(): void
    {
        $this->expectException(ValidationException::class);

        $order = $this->makeOrder(['payment_status' => 'pending']);

        app(OrderStateMachineService::class)
            ->transition($order, 'confirmed', $order->restaurant->owner, 'vendor');
    }

    public function test_vendor_cannot_confirm_when_restaurant_closed(): void
    {
        $this->expectException(ValidationException::class);

        $order = $this->makeOrder(['payment_status' => 'paid'], restaurantOpen: false);

        app(OrderStateMachineService::class)
            ->transition($order, 'confirmed', $order->restaurant->owner, 'vendor');
    }

    public function test_refuse_requires_reason(): void
    {
        $this->expectException(ValidationException::class);

        $order = $this->makeOrder(['payment_status' => 'paid']);

        app(OrderStateMachineService::class)
            ->transition($order, 'refused', $order->restaurant->owner, 'vendor', null);
    }

    public function test_student_cannot_cancel_after_window(): void
    {
        $this->expectException(ValidationException::class);

        $order = $this->makeOrder([
            'payment_status' => 'paid',
            'created_at' => now()->subMinutes(30),
        ]);

        app(OrderStateMachineService::class)
            ->transition($order, 'cancelled', $order->student, 'student', 'Change d\'avis');
    }

    public function test_terminal_order_cannot_transition(): void
    {
        $this->expectException(ValidationException::class);

        $order = $this->makeOrder(['status' => 'delivered', 'payment_status' => 'paid']);

        app(OrderStateMachineService::class)
            ->transition($order, 'confirmed', $order->restaurant->owner, 'vendor');
    }

    public function test_full_happy_path_to_delivered(): void
    {
        $machine = app(OrderStateMachineService::class);
        $order = $this->makeOrder(['payment_status' => 'paid']);

        $order = $machine->transition($order, 'confirmed', $order->restaurant->owner, 'vendor');
        $order = $machine->transition($order, 'delivering', null, 'delivery');
        $order = $machine->transition($order, 'delivered', null, 'delivery');

        $this->assertSame('delivered', $order->status);
        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'to_status' => 'delivered',
        ]);
    }
}
