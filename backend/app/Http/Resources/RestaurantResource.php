<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'address' => $this->address,
            'image_url' => $this->image_url,
            'cover_url' => $this->cover_url,
            'rating' => (float) $this->rating,
            'is_open' => (bool) $this->is_open,
            'is_approved' => (bool) $this->is_approved,
            'delivery_time' => (int) $this->delivery_time,
            'delivery_fee' => (float) $this->delivery_fee,
            'opening_hours' => $this->opening_hours,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
