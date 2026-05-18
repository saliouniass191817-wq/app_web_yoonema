<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminFinanceController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $today = now()->startOfDay();
        $week = now()->startOfWeek();
        $month = now()->startOfMonth();

        $revenueFor = fn (Carbon $start) => DB::table('orders')
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $start)
            ->selectRaw('COALESCE(SUM(platform_commission), 0) as commissions, COALESCE(SUM(delivery_fee_platform), 0) as delivery_fees')
            ->first();

        $chart = DB::table('orders')
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(30)->startOfDay())
            ->selectRaw('DATE(created_at) as date, COALESCE(SUM(platform_commission + delivery_fee_platform), 0) as revenue')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        return $this->success([
            'today' => $revenueFor($today),
            'week' => $revenueFor($week),
            'month' => $revenueFor($month),
            'pending_payouts' => DB::table('vendor_payouts')->where('status', 'pending')->orderByDesc('created_at')->get(),
            'chart' => $chart,
        ], 'Données financières récupérées.');
    }

    public function markPayoutProcessed(Request $request, int $payout): JsonResponse
    {
        DB::table('vendor_payouts')
            ->where('id', $payout)
            ->update([
                'status' => 'completed',
                'payout_reference' => $request->input('payout_reference'),
                'processed_at' => now(),
                'updated_at' => now(),
            ]);

        return $this->success(null, 'Virement marqué comme traité.');
    }
}
