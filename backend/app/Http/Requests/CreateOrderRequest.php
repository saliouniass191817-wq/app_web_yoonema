<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'restaurant_id' => 'required|uuid|exists:restaurants,id',
            'delivery_person_id' => 'nullable|uuid|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|uuid|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'delivery_address' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'restaurant_id.required' => 'Le restaurant est requis',
            'items.required' => 'Au moins un article est requis',
            'delivery_address.required' => 'L\'adresse de livraison est requise',
        ];
    }
}
