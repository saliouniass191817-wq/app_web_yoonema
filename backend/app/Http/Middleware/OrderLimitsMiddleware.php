<?php

namespace App\Http\Middleware;

use App\Models\Order;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderLimitsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Authentification requise.'], 401);
        }

        $activeOrders = Order::query()
            ->where('student_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'delivering'])
            ->count();

        $maxActive = (int) config('yoonema.max_active_orders', 2);

        if ($activeOrders >= $maxActive) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Vous avez déjà {$maxActive} commandes actives.",
            ], 429);
        }

        $maxPerDay = (int) config('yoonema.max_orders_per_day', 10);

        $ordersToday = Order::query()
            ->where('student_id', $user->id)
            ->whereDate('created_at', today())
            ->count();

        if ($ordersToday >= $maxPerDay) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Vous avez atteint la limite de {$maxPerDay} commandes aujourd’hui.",
            ], 429);
        }

        $cooldownMinutes = (int) config('yoonema.order_cooldown_minutes', 2);

        if ($user->last_order_at && $user->last_order_at->copy()->addMinutes($cooldownMinutes)->isFuture()) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Veuillez patienter {$cooldownMinutes} minutes entre deux commandes.",
            ], 429);
        }

        $quantity = collect($request->input('items', []))->sum(fn ($item) => (int) ($item['quantity'] ?? 0));

        if ($quantity < 1) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Le panier est vide.'], 422);
        }

        return $next($request);
    }
}
