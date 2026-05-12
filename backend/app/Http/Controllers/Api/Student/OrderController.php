<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(OrderRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['student_id'] = $request->user()->id;

        $order = app(OrderService::class)->createOrder($payload);

        return response()->json(['success' => true, 'data' => new OrderResource($order), 'message' => 'Commande placée avec succès.'], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->where('student_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders), 'message' => 'Historique des commandes récupéré.']);
    }

    public function show(Order $order): JsonResponse
    {
        if ($order->student_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Accès refusé à la commande.'], 403);
        }

        return response()->json(['success' => true, 'data' => new OrderResource($order), 'message' => 'Détails de la commande.']);
    }

    public function cancel(Order $order): JsonResponse
    {
        if ($order->student_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Accès refusé.'], 403);
        }

        if (! in_array($order->status, ['pending', 'confirmed'], true)) {
            return response()->json(['success' => false, 'message' => 'Cette commande ne peut plus être annulée.'], 422);
        }

        $order->update([
            'status' => 'cancelled',
            'cancel_reason' => 'Annulation par l’étudiant',
            'cancelled_by' => 'student',
        ]);

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande annulée.']);
    }
}
