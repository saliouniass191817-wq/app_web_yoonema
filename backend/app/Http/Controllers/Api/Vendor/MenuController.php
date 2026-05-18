<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $restaurant = Restaurant::where('owner_id', auth()->id())->first();

        if (! $restaurant) {
            return response()->json(['success' => false, 'message' => 'Aucun restaurant trouvé.'], 404);
        }

        $items = $restaurant->menuItems()->orderBy('name')->get();

        return response()->json(['success' => true, 'data' => MenuItemResource::collection($items), 'message' => 'Menu récupéré.']);
    }

    public function store(Request $request): JsonResponse
    {
        $restaurant = Restaurant::where('owner_id', auth()->id())->first();

        if (! $restaurant) {
            return response()->json(['success' => false, 'message' => 'Aucun restaurant trouvé.'], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        $item = MenuItem::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'restaurant_id' => $restaurant->id,
            'is_available' => $validated['is_available'] ?? true,
        ]));

        return response()->json(['success' => true, 'data' => new MenuItemResource($item), 'message' => 'Article ajouté au menu.']);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $this->authorizeMenuItem($menuItem);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        $menuItem->update($validated);

        return response()->json(['success' => true, 'data' => new MenuItemResource($menuItem), 'message' => 'Article de menu mis à jour.']);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $this->authorizeMenuItem($menuItem);

        $menuItem->delete();

        return response()->json(['success' => true, 'message' => 'Article de menu supprimé.']);
    }

    private function authorizeMenuItem(MenuItem $menuItem): void
    {
        abort_if(! $menuItem->restaurant || $menuItem->restaurant->owner_id !== auth()->id(), 403, 'Accès non autorisé.');
    }
}
