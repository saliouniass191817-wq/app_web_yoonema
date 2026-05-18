<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function createOrder(array $payload): Order
    {
        return DB::transaction(function () use ($payload) {
            /** @var Restaurant $restaurant */
            $restaurant = Restaurant::findOrFail($payload['restaurant_id']);

            $pricing = app(OrderPricingService::class)->buildValidatedPayload($restaurant, $payload['items']);

            $order = new Order([
                'id' => (string) Str::uuid(),
                'student_id' => $payload['student_id'],
                'restaurant_id' => $restaurant->id,
                'restaurant_name' => $restaurant->name,
                'delivery_person_id' => $payload['delivery_person_id'] ?? null,
                'items' => $pricing['items'],
                'total_amount' => $pricing['total_amount'],
                'status' => 'pending',
                'delivery_address' => $payload['delivery_address'],
                'expires_at' => now()->addMinutes((int) config('yoonema.order_expiry_minutes', 15)),
            ]);

            $split = app(PaymentService::class)->calculateSplit($order);

            $order->fill([
                'delivery_fee' => $split['delivery_fee_student'],
                'subtotal' => $split['subtotal'],
                'platform_commission' => $split['platform_commission'],
                'vendor_amount' => $split['vendor_amount'],
                'delivery_fee_student' => $split['delivery_fee_student'],
                'delivery_fee_platform' => $split['delivery_fee_platform'],
                'payment_status' => 'pending',
            ])->save();

            User::query()->whereKey($payload['student_id'])->update(['last_order_at' => now()]);

            $this->notifyUser(
                $payload['student_id'],
                'Commande créée',
                'Finalisez le paiement pour envoyer la commande au restaurant.',
                $order->id
            );

            app(SupabaseSyncService::class)->syncOrder($order);

            return $order;
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->status = $status;
        $order->save();

        return $order;
    }

    public function notifyUser(string $userId, string $title, string $body, ?string $orderId = null): Notification
    {
        return (new NotificationService())->notifyUser($userId, $title, $body, $orderId);
    }
}
