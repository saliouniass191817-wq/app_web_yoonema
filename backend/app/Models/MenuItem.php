<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    protected $fillable = [
        'id',
        'restaurant_id',
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'is_available',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
