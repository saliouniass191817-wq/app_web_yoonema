<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function available(): JsonResponse
    {
        $orders = Order::query()
            ->whereNull('delivery_person_id')
            ->where('status', 'ready')
            ->orderBy('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Commandes prêtes pour livraison.']);
    }

    public function accept(Order $order): JsonResponse
    {
        abort_if($order->delivery_person_id && $order->delivery_person_id !== auth()->id(), 403, 'Accès non autorisé.');
        abort_if($order->status !== 'ready', 422, 'Cette commande n’est pas disponible pour la prise en charge.');

        $order->update([
            'delivery_person_id' => auth()->id(),
            'status' => 'delivering',
        ]);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Livraison acceptée.']);
    }

    public function refuse(Order $order): JsonResponse
    {
        abort_if($order->delivery_person_id !== auth()->id(), 403, 'Accès non autorisé.');

        $order->update([
            'delivery_person_id' => null,
            'status' => 'ready',
        ]);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Livraison refusée.']);
    }

    public function delivered(Order $order): JsonResponse
    {
        abort_if($order->delivery_person_id !== auth()->id(), 403, 'Accès non autorisé.');
        abort_if($order->status !== 'delivering', 422, 'Impossible de marquer cette commande comme livrée.');

        $order->update(['status' => 'delivered']);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande livrée.']);
    }

    public function history(): JsonResponse
    {
        $orders = Order::query()
            ->where('delivery_person_id', auth()->id())
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Historique des livraisons récupéré.']);
    }

    public function availability(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'is_available' => ['required', 'boolean'],
        ]);

        $driver = $request->user();
        $driver->update(['is_available' => $validated['is_available']]);

        return response()->json(['success' => true, 'data' => $driver->fresh(), 'message' => 'Disponibilité mise à jour.']);
    }
}
