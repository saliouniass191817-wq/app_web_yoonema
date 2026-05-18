<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Validation\ValidationException;

class OrderPricingService
{
    /**
     * @return array{items: array<int, array<string, mixed>>, subtotal: float, total_amount: float, quantity: int}
     */
    public function buildValidatedPayload(Restaurant $restaurant, array $requestedItems): array
    {
        $menuItems = MenuItem::query()
            ->where('restaurant_id', $restaurant->id)
            ->whereIn('id', collect($requestedItems)->pluck('id'))
            ->get()
            ->keyBy('id');

        $items = [];
        $subtotal = 0.0;
        $quantity = 0;

        foreach ($requestedItems as $requested) {
            $menuItemId = (string) ($requested['id'] ?? '');
            $requestedQty = (int) ($requested['quantity'] ?? 0);

            if ($requestedQty < 1) {
                throw ValidationException::withMessages([
                    'items' => 'Quantité invalide pour un article du panier.',
                ]);
            }

            /** @var MenuItem|null $menuItem */
            $menuItem = $menuItems->get($menuItemId);

            if (! $menuItem || ! $menuItem->is_available) {
                throw ValidationException::withMessages([
                    'items' => "L'article « ".($requested['name'] ?? $menuItemId)." » n'est plus disponible.",
                ]);
            }

            $linePrice = (float) $menuItem->price;
            $lineTotal = round($linePrice * $requestedQty, 2);

            $items[] = [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'price' => $linePrice,
                'quantity' => $requestedQty,
            ];

            $subtotal += $lineTotal;
            $quantity += $requestedQty;
        }

        if ($items === []) {
            throw ValidationException::withMessages([
                'items' => 'Le panier est vide.',
            ]);
        }

        return [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'total_amount' => round($subtotal, 2),
            'quantity' => $quantity,
        ];
    }

    public function minimumOrderAmount(int $quantity): float
    {
        return $quantity * (float) config('yoonema.delivery_fee_per_unit', 200);
    }
}
