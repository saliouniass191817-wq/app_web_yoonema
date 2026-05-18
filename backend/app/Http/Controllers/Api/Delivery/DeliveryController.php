<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderStateMachineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeliveryController extends Controller
{
    public function available(): JsonResponse
    {
        $orders = Order::query()
            ->where(function ($query) {
                $query->whereNull('delivery_person_id')
                    ->orWhere('delivery_person_id', auth()->id());
            })
            ->whereIn('status', ['confirmed', 'delivering'])
            ->orderBy('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Commandes disponibles pour livraison.']);
    }

    public function accept(Request $request, Order $order, OrderStateMachineService $stateMachine): JsonResponse
    {
        abort_if(
            $order->delivery_person_id && $order->delivery_person_id !== auth()->id(),
            403,
            'Cette livraison est réservée à un autre livreur.'
        );
        abort_if($order->status !== 'confirmed', 422, 'Cette commande n’est pas disponible pour la prise en charge.');
        abort_if(! $request->user()->is_available, 422, 'Mettez-vous disponible pour accepter une livraison.');

        try {
            $order = DB::transaction(function () use ($order, $request, $stateMachine) {
                $order->update(['delivery_person_id' => $request->user()->id]);

                return $stateMachine->transition($order->fresh(), 'delivering', $request->user(), 'delivery');
            });
        } catch (ValidationException $exception) {
            return response()->json(['success' => false, 'data' => null, 'message' => $exception->errors()['status'][0] ?? 'Transition invalide.'], 422);
        }

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Livraison acceptée.']);
    }

    public function delivered(Request $request, Order $order, OrderStateMachineService $stateMachine): JsonResponse
    {
        abort_if($order->delivery_person_id !== auth()->id(), 403, 'Accès non autorisé.');
        abort_if($order->status !== 'delivering', 422, 'Impossible de marquer cette commande comme livrée.');

        try {
            $order = $stateMachine->transition($order, 'delivered', $request->user(), 'delivery');
        } catch (ValidationException $exception) {
            return response()->json(['success' => false, 'data' => null, 'message' => $exception->errors()['status'][0] ?? 'Transition invalide.'], 422);
        }

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
