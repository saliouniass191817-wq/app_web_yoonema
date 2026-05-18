<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\OrderStateMachineService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(OrderRequest $request): JsonResponse
    {
        try {
            $order = DB::transaction(function () use ($request) {
                $payload = $request->validated();
                $payload['student_id'] = $request->user()->id;

                return app(OrderService::class)->createOrder($payload);
            });
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => collect($exception->errors())->flatten()->first() ?? 'Commande invalide.',
                'errors' => $exception->errors(),
            ], 422);
        }

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
            return response()->json(['success' => false, 'data' => null, 'message' => 'Accès refusé à la commande.'], 403);
        }

        $order->load(['restaurant', 'deliveryPerson']);

        return response()->json(['success' => true, 'data' => new OrderResource($order), 'message' => 'Détails de la commande.']);
    }

    public function cancel(Request $request, Order $order, OrderStateMachineService $stateMachine, PaymentService $payments): JsonResponse
    {
        if ($order->student_id !== auth()->id()) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Accès refusé.'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Cette commande ne peut plus être annulée.'], 422);
        }

        if ($order->created_at->copy()->addMinutes((int) config('yoonema.cancellation_window_minutes', 5))->lessThanOrEqualTo(now())) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Annulation impossible après 5 minutes'], 403);
        }

        try {
            $order = DB::transaction(function () use ($order, $request, $stateMachine, $payments) {
                $cancelled = $stateMachine->transition(
                    $order,
                    'cancelled',
                    $request->user(),
                    'student',
                    $request->input('reason', 'Annulation par l’étudiant')
                );

                $payments->processRefund($cancelled, (float) $cancelled->total_amount + (float) $cancelled->delivery_fee_student, 'Annulation par l’étudiant');

                return $cancelled;
            });
        } catch (ValidationException $exception) {
            return response()->json(['success' => false, 'data' => null, 'message' => $exception->errors()['status'][0] ?? 'Transition invalide.'], 422);
        }

        return response()->json(['success' => true, 'data' => new OrderResource($order->fresh()), 'message' => 'Commande annulée.']);
    }
}
