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
            'subtotal' => (float) ($this->subtotal ?? $this->total_amount),
            'platform_commission' => (float) $this->platform_commission,
            'vendor_amount' => (float) $this->vendor_amount,
            'delivery_fee_student' => (float) ($this->delivery_fee_student ?? $this->delivery_fee),
            'delivery_fee_platform' => (float) $this->delivery_fee_platform,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'payment_reference' => $this->payment_reference,
            'paid_at' => $this->paid_at,
            'expires_at' => $this->expires_at,
            'restaurant' => $this->whenLoaded('restaurant', fn () => $this->restaurant ? [
                'id' => $this->restaurant->id,
                'delivery_time' => $this->restaurant->delivery_time,
            ] : null),
            'delivery_person' => $this->whenLoaded('deliveryPerson', fn () => $this->deliveryPerson ? [
                'id' => $this->deliveryPerson->id,
                'name' => $this->deliveryPerson->name,
                'phone' => $this->deliveryPerson->phone,
            ] : null),
            'status' => $this->status,
            'delivery_address' => $this->delivery_address,
            'cancel_reason' => $this->cancel_reason,
            'refused_reason' => $this->refused_reason,
            'cancelled_reason' => $this->cancelled_reason,
            'cancelled_by' => $this->cancelled_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
