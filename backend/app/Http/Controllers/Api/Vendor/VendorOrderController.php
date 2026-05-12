<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $restaurant = Restaurant::query()->where('owner_id', auth()->id())->firstOrFail();

        $orders = Order::query()
            ->where('restaurant_id', $restaurant->id)
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Commandes du restaurant récupérées.']);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $this->authorizeOrder($order);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:confirmed,preparing,ready'],
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Statut de la commande mis à jour.']);
    }

    public function refuse(Request $request, Order $order): JsonResponse
    {
        $this->authorizeOrder($order);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $order->update([
            'status' => 'cancelled',
            'cancel_reason' => $validated['reason'],
            'cancelled_by' => 'vendor',
        ]);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande refusée.']);
    }

    public function stats(): JsonResponse
    {
        $restaurant = Restaurant::query()->where('owner_id', auth()->id())->firstOrFail();

        $stats = Order::query()
            ->where('restaurant_id', $restaurant->id)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json(['success' => true, 'data' => $stats, 'message' => 'Statistiques des commandes récupérées.']);
    }

    private function authorizeOrder(Order $order): void
    {
        abort_if(! $order->restaurant || $order->restaurant->owner_id !== auth()->id(), 403, 'Accès non autorisé.');
    }
}
