<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Restaurant;
use App\Services\OrderStateMachineService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VendorOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $restaurant = $this->resolveRestaurant();
        if ($restaurant instanceof JsonResponse) {
            return $restaurant;
        }

        $orders = Order::query()
            ->where('restaurant_id', $restaurant->id)
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Commandes du restaurant récupérées.']);
    }

    public function updateStatus(Request $request, Order $order, OrderStateMachineService $stateMachine): JsonResponse
    {
        $this->authorizeOrder($order);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:confirmed'],
        ]);

        try {
            $order = $stateMachine->transition($order, $validated['status'], $request->user(), 'vendor');
        } catch (ValidationException $exception) {
            return response()->json(['success' => false, 'data' => null, 'message' => $exception->errors()['status'][0] ?? 'Transition invalide.'], 422);
        }

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande acceptée.']);
    }

    public function refuse(Request $request, Order $order, OrderStateMachineService $stateMachine, PaymentService $payments): JsonResponse
    {
        $this->authorizeOrder($order);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        try {
            $order = DB::transaction(function () use ($order, $request, $validated, $stateMachine, $payments) {
                $refused = $stateMachine->transition($order, 'refused', $request->user(), 'vendor', $validated['reason']);
                $payments->processRefund($refused, (float) $refused->total_amount + (float) $refused->delivery_fee_student, $validated['reason']);

                return $refused;
            });
        } catch (ValidationException $exception) {
            return response()->json(['success' => false, 'data' => null, 'message' => $exception->errors()['status'][0] ?? 'Transition invalide.'], 422);
        }

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande refusée.']);
    }

    public function stats(): JsonResponse
    {
        $restaurant = $this->resolveRestaurant();
        if ($restaurant instanceof JsonResponse) {
            return $restaurant;
        }

        $ordersByStatus = Order::query()
            ->where('restaurant_id', $restaurant->id)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $deliveredOrders = Order::query()
            ->where('restaurant_id', $restaurant->id)
            ->where('status', 'delivered');

        $payments = DB::table('vendor_payouts')
            ->where('vendor_id', auth()->id())
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $ordersByStatus,
                'total_orders' => (int) $ordersByStatus->sum(),
                'total_revenue' => (float) (clone $deliveredOrders)->sum('vendor_amount'),
                'average_order' => (float) (clone $deliveredOrders)->avg('vendor_amount'),
                'average_rating' => (float) ($restaurant->rating ?? 0),
                'payments' => [
                    'pending_amount' => (float) $payments->where('status', 'pending')->sum('amount'),
                    'last_payout_date' => optional($payments->where('status', 'completed')->first())->processed_at,
                    'history' => $payments,
                ],
            ],
            'message' => 'Statistiques des commandes récupérées.',
        ]);
    }

    private function authorizeOrder(Order $order): void
    {
        abort_if(! $order->restaurant || $order->restaurant->owner_id !== auth()->id(), 403, 'Accès non autorisé.');
    }

    private function resolveRestaurant(): Restaurant|JsonResponse
    {
        $restaurant = Restaurant::query()->where('owner_id', auth()->id())->first();

        if (! $restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun restaurant trouvé. Configurez votre restaurant pour continuer.',
            ], 404);
        }

        return $restaurant;
    }
}
