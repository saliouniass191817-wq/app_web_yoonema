<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'address' => $this->address,
            'avatar_url' => $this->avatar_url,
            'restaurant_id' => $this->restaurant_id,
            'is_available' => $this->is_available,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}
