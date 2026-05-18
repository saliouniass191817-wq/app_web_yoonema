<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function store(ReviewRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $order = Order::query()->findOrFail($payload['order_id']);

        if ($order->student_id !== auth()->id()) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Accès refusé.'], 403);
        }

        if ($order->status !== 'delivered') {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Vous ne pouvez noter qu’une commande livrée.'], 422);
        }

        if ($order->restaurant_id !== $payload['restaurant_id']) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Restaurant invalide pour cette commande.'], 422);
        }

        if (Review::query()->where('order_id', $order->id)->exists()) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Cette commande a déjà été notée.'], 422);
        }

        $payload['student_id'] = auth()->id();
        $payload['id'] = (string) \Illuminate\Support\Str::uuid();

        $review = Review::create($payload);

        return response()->json(['success' => true, 'data' => new ReviewResource($review), 'message' => 'Votre avis a été enregistré.']);
    }
}
