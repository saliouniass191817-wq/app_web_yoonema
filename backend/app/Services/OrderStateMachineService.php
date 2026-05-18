<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderStateMachineService
{
    private array $terminalStatuses = ['refused', 'cancelled', 'expired', 'delivered'];

    public function transition(Order $order, string $toStatus, ?User $actor, string $actorRole, ?string $reason = null, array $metadata = []): Order
    {
        return DB::transaction(function () use ($order, $toStatus, $actor, $actorRole, $reason, $metadata) {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);
            $fromStatus = $order->status;

            $this->validateTransition($order, $fromStatus, $toStatus, $actorRole, $reason);

            $updates = ['status' => $toStatus];

            if ($toStatus === 'refused') {
                $updates['refused_reason'] = $reason;
            }

            if ($toStatus === 'cancelled') {
                $updates['cancelled_reason'] = $reason;
                $updates['cancelled_by'] = $actorRole;
            }

            $order->update($updates);
            $order->refresh();

            app(SupabaseSyncService::class)->syncOrder($order);

            DB::table('order_status_logs')->insert([
                'order_id' => $order->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'actor_id' => $actor?->id,
                'actor_role' => $actorRole,
                'reason' => $reason,
                'metadata' => json_encode($metadata),
                'created_at' => now(),
            ]);

            return $order;
        });
    }

    private function validateTransition(Order $order, string $fromStatus, string $toStatus, string $actorRole, ?string $reason): void
    {
        if (in_array($fromStatus, $this->terminalStatuses, true)) {
            throw ValidationException::withMessages([
                'status' => 'Cette commande est déjà terminée et ne peut plus être modifiée.',
            ]);
        }

        if ($fromStatus === $toStatus) {
            throw ValidationException::withMessages([
                'status' => 'La commande possède déjà ce statut.',
            ]);
        }

        $allowed = match (true) {
            $fromStatus === 'pending' && $toStatus === 'confirmed' => $this->vendorCanConfirm($order, $actorRole),
            $fromStatus === 'pending' && $toStatus === 'refused' => $actorRole === 'vendor' && filled($reason),
            $fromStatus === 'pending' && $toStatus === 'cancelled' => $actorRole === 'student' && $this->withinCancellationWindow($order),
            $fromStatus === 'pending' && $toStatus === 'expired' => $actorRole === 'system' && $this->isExpired($order),
            $fromStatus === 'confirmed' && $toStatus === 'cancelled' => in_array($actorRole, ['vendor', 'system'], true) && filled($reason),
            $fromStatus === 'confirmed' && $toStatus === 'delivering' => $actorRole === 'delivery',
            $fromStatus === 'delivering' && $toStatus === 'delivered' => $actorRole === 'delivery',
            default => false,
        };

        if (! $allowed) {
            throw ValidationException::withMessages([
                'status' => $this->messageForInvalidTransition($order, $fromStatus, $toStatus, $actorRole, $reason),
            ]);
        }
    }

    private function vendorCanConfirm(Order $order, string $actorRole): bool
    {
        return $actorRole === 'vendor'
            && (bool) $order->restaurant?->is_open
            && $order->payment_status === 'paid';
    }

    private function withinCancellationWindow(Order $order): bool
    {
        return $order->created_at
            ->copy()
            ->addMinutes((int) config('yoonema.cancellation_window_minutes', 5))
            ->greaterThan(now());
    }

    private function isExpired(Order $order): bool
    {
        return $order->expires_at
            ? Carbon::parse($order->expires_at)->lessThanOrEqualTo(now())
            : $order->created_at->copy()->addMinutes((int) config('yoonema.order_expiry_minutes', 15))->lessThanOrEqualTo(now());
    }

    private function messageForInvalidTransition(Order $order, string $fromStatus, string $toStatus, string $actorRole, ?string $reason): string
    {
        if ($fromStatus === 'pending' && $toStatus === 'confirmed' && $actorRole === 'vendor') {
            if ($order->payment_status !== 'paid') {
                return 'Le paiement doit être confirmé avant d’accepter la commande.';
            }

            return 'Le restaurant doit être ouvert pour accepter une commande.';
        }

        if (in_array($toStatus, ['refused', 'cancelled'], true) && blank($reason)) {
            return 'Une raison est obligatoire pour cette action.';
        }

        if ($fromStatus === 'pending' && $toStatus === 'cancelled' && $actorRole === 'student') {
            return 'Annulation impossible après 5 minutes.';
        }

        return 'Transition de commande non autorisée.';
    }
}
