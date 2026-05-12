<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'restaurant_id' => $this->restaurant_id,
            'restaurant_name' => $this->restaurant_name,
            'delivery_person_id' => $this->delivery_person_id,
            'items' => $this->items,
            'total_amount' => (float) $this->total_amount,
            'delivery_fee' => (float) $this->delivery_fee,
            'status' => $this->status,
            'delivery_address' => $this->delivery_address,
            'cancel_reason' => $this->cancel_reason,
            'cancelled_by' => $this->cancelled_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
