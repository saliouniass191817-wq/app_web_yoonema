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

            $order = Order::create([
                'id' => (string) Str::uuid(),
                'student_id' => $payload['student_id'],
                'restaurant_id' => $restaurant->id,
                'restaurant_name' => $restaurant->name,
                'items' => $payload['items'],
                'total_amount' => $payload['total_amount'],
                'delivery_fee' => $restaurant->delivery_fee,
                'status' => 'pending',
                'delivery_address' => $payload['delivery_address'],
            ]);

            $this->notifyUser($restaurant->owner_id, 'Nouvelle commande', 'Une nouvelle commande attend votre validation.', $order->id);

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
