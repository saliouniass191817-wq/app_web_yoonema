<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public function notifyUser(string $userId, string $title, string $body, ?string $orderId = null, string $type = 'order'): Notification
    {
        return Notification::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $userId,
            'title' => $title,
            'body' => $body,
            'type' => $type,
            'order_id' => $orderId,
            'is_read' => false,
        ]);
    }
}
