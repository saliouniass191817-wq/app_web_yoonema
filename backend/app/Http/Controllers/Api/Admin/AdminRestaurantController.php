<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;

class AdminRestaurantController extends Controller
{
    public function index(): JsonResponse
    {
        $restaurants = Restaurant::with('owner')->orderBy('created_at', 'desc')->get();

        return response()->json(['success' => true, 'data' => $restaurants, 'message' => 'Liste des restaurants récupérée.']);
    }

    public function approve(Restaurant $restaurant): JsonResponse
    {
        $restaurant->update(['is_approved' => true]);

        return response()->json(['success' => true, 'data' => $restaurant, 'message' => 'Restaurant approuvé.']);
    }

    public function reject(Restaurant $restaurant): JsonResponse
    {
        $restaurant->update(['is_approved' => false]);

        return response()->json(['success' => true, 'data' => $restaurant, 'message' => 'Restaurant rejeté.']);
    }
}
