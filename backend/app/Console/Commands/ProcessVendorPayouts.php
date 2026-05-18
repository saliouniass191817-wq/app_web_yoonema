<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessVendorPayouts extends Command
{
    protected $signature = 'yoonema:process-vendor-payouts';

    protected $description = 'Crée les virements vendeurs hebdomadaires.';

    public function handle(NotificationService $notifications): int
    {
        $periodEnd = now()->startOfDay();
        $periodStart = $periodEnd->copy()->subDays(7);

        $orders = Order::query()
            ->with('restaurant')
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->where('payout_processed', false)
            ->whereBetween('updated_at', [$periodStart, $periodEnd])
            ->get()
            ->filter(fn (Order $order) => $order->restaurant?->owner_id);

        $orders->groupBy(fn (Order $order) => $order->restaurant->owner_id)
            ->each(function ($vendorOrders, string $vendorId) use ($periodStart, $periodEnd, $notifications) {
                DB::transaction(function () use ($vendorOrders, $vendorId, $periodStart, $periodEnd, $notifications) {
                    $amount = round($vendorOrders->sum(fn (Order $order) => (float) $order->vendor_amount), 2);

                    if ($amount <= 0) {
                        return;
                    }

                    DB::table('vendor_payouts')->insert([
                        'vendor_id' => $vendorId,
                        'amount' => $amount,
                        'orders_count' => $vendorOrders->count(),
                        'status' => 'pending',
                        'period_start' => $periodStart->toDateString(),
                        'period_end' => $periodEnd->copy()->subDay()->toDateString(),
                        'payout_method' => 'wave',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    Order::query()
                        ->whereIn('id', $vendorOrders->pluck('id'))
                        ->update(['payout_processed' => true]);

                    $notifications->notifyUser($vendorId, 'Virement initié', 'Virement de '.number_format($amount, 0, ',', ' ').' FCFA initié');
                });
            });

        return self::SUCCESS;
    }
}
