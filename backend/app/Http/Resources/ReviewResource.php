<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'order_id' => $this->order_id,
            'restaurant_id' => $this->restaurant_id,
            'delivery_person_id' => $this->delivery_person_id,
            'restaurant_rating' => (int) $this->restaurant_rating,
            'delivery_rating' => (int) $this->delivery_rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
        ];
    }
}
