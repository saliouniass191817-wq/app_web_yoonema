<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RestaurantController extends Controller
{
    public function show(): JsonResponse
    {
        $restaurant = Restaurant::where('owner_id', auth()->id())->first();

        if (! $restaurant) {
            return response()->json(['success' => false, 'message' => 'Aucun restaurant trouvé pour ce vendeur.'], 404);
        }

        return response()->json(['success' => true, 'data' => new RestaurantResource($restaurant), 'message' => 'Restaurant récupéré.']);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'address' => ['required', 'string', 'max:500'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'cover_url' => ['nullable', 'string', 'max:1000'],
            'delivery_time' => ['nullable', 'integer', 'min:0'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.*' => ['nullable', 'string', 'max:255'],
            'is_open' => ['nullable', 'boolean'],
        ]);

        $restaurant = Restaurant::firstOrNew(['owner_id' => auth()->id()]);

        if (! $restaurant->exists) {
            $restaurant->id = (string) Str::uuid();
            $restaurant->owner_id = auth()->id();
        }

        $restaurant->fill(array_merge($validated, [
            'is_approved' => $restaurant->exists ? $restaurant->is_approved : false,
        ]));
        $restaurant->save();

        return response()->json(['success' => true, 'data' => new RestaurantResource($restaurant), 'message' => 'Restaurant mis à jour.']);
    }
}
