<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseSyncService
{
    public function isEnabled(): bool
    {
        return (bool) config('services.supabase.sync_enabled')
            && config('services.supabase.url')
            && config('services.supabase.key');
    }

    public function syncNotification(Notification $notification): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $this->upsert('notifications', [
            'id' => $notification->id,
            'user_id' => $notification->user_id,
            'title' => $notification->title,
            'body' => $notification->body,
            'type' => $notification->type,
            'order_id' => $notification->order_id,
            'is_read' => $notification->is_read,
            'created_at' => $notification->created_at?->toIso8601String(),
            'updated_at' => $notification->updated_at?->toIso8601String(),
        ]);
    }

    public function syncOrder(Order $order): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $order->loadMissing(['restaurant']);

        $this->upsert('orders', [
            'id' => $order->id,
            'student_id' => $order->student_id,
            'restaurant_id' => $order->restaurant_id,
            'restaurant_name' => $order->restaurant_name,
            'delivery_person_id' => $order->delivery_person_id,
            'items' => $order->items,
            'total_amount' => (float) $order->total_amount,
            'delivery_fee' => (float) ($order->delivery_fee ?? 0),
            'subtotal' => (float) ($order->subtotal ?? $order->total_amount),
            'platform_commission' => (float) ($order->platform_commission ?? 0),
            'vendor_amount' => (float) ($order->vendor_amount ?? 0),
            'delivery_fee_student' => (float) ($order->delivery_fee_student ?? $order->delivery_fee ?? 0),
            'delivery_fee_platform' => (float) ($order->delivery_fee_platform ?? 0),
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'payment_reference' => $order->payment_reference,
            'paid_at' => $order->paid_at?->toIso8601String(),
            'status' => $order->status,
            'delivery_address' => $order->delivery_address,
            'refused_reason' => $order->refused_reason,
            'cancelled_reason' => $order->cancelled_reason,
            'cancelled_by' => $order->cancelled_by,
            'expires_at' => $order->expires_at?->toIso8601String(),
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
        ]);
    }

    private function upsert(string $table, array $row): void
    {
        $baseUrl = rtrim((string) config('services.supabase.url'), '/');
        $key = (string) config('services.supabase.key');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$key,
                'apikey' => $key,
                'Content-Type' => 'application/json',
                'Prefer' => 'resolution=merge-duplicates,return=minimal',
            ])->timeout(10)->post($baseUrl.'/rest/v1/'.$table, [$row]);

            if (! $response->successful()) {
                Log::warning('Supabase sync failed', [
                    'table' => $table,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $exception) {
            Log::warning('Supabase sync exception', [
                'table' => $table,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
