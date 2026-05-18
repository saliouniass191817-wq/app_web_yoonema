<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Restaurant::query()
            ->where('is_approved', true)
            ->where('is_open', true);

        if ($request->filled('categorie')) {
            $query->whereJsonContains('opening_hours', $request->input('categorie'));
        }

        if ($request->filled('prix_min')) {
            $query->where('delivery_fee', '>=', $request->input('prix_min'));
        }

        if ($request->filled('prix_max')) {
            $query->where('delivery_fee', '<=', $request->input('prix_max'));
        }

        if ($request->filled('note')) {
            $query->where('rating', '>=', $request->input('note'));
        }

        if ($request->filled('delai_max')) {
            $query->where('delivery_time', '<=', $request->input('delai_max'));
        }

        $restaurants = $query->withCount('menuItems')->orderBy('rating', 'desc')->paginate(12);

        return response()->json(['success' => true, 'data' => RestaurantResource::collection($restaurants), 'message' => 'Liste des restaurants fournie.']);
    }

    public function show(Restaurant $restaurant): JsonResponse
    {
        if (! $restaurant->is_approved) {
            return response()->json(['success' => false, 'message' => 'Restaurant introuvable.'], 404);
        }

        return response()->json(['success' => true, 'data' => new RestaurantResource($restaurant), 'message' => 'Restaurant récupéré.']);
    }

    public function menu(Restaurant $restaurant): JsonResponse
    {
        $items = $restaurant->menuItems()->where('is_available', true)->orderBy('name')->get();

        return response()->json(['success' => true, 'data' => MenuItemResource::collection($items), 'message' => 'Menu récupéré.']);
    }

    public function availableDeliveryPersons(): JsonResponse
    {
        $drivers = User::where('role', 'delivery')->where('is_available', true)->where('is_active', true)->get();

        return response()->json(['success' => true, 'data' => $drivers, 'message' => 'Livreurs disponibles.']);
    }
}
