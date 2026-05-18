<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\NotificationService;
use App\Services\OrderStateMachineService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExpireStaleOrdersJob implements ShouldQueue
{
    use Queueable;

    public function handle(OrderStateMachineService $stateMachine, NotificationService $notifications): void
    {
        Order::query()
            ->where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->chunkById(50, function ($orders) use ($stateMachine, $notifications) {
                foreach ($orders as $order) {
                    try {
                        DB::transaction(function () use ($stateMachine, $notifications, $order) {
                            $expired = $stateMachine->transition($order, 'expired', null, 'system', "Le restaurant n'a pas répondu dans le délai prévu.");

                            $notifications->notifyUser(
                                $expired->student_id,
                                'Commande expirée',
                                "Votre commande a expiré car le restaurant n'a pas répondu.",
                                $expired->id
                            );
                        });
                    } catch (ValidationException) {
                    }
                }
            }, 'id');
    }
}
