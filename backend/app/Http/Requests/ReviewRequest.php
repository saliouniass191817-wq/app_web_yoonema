<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'string', 'exists:orders,id'],
            'restaurant_id' => ['required', 'string', 'exists:restaurants,id'],
            'restaurant_rating' => ['required', 'integer', 'between:1,5'],
            'delivery_rating' => ['nullable', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
