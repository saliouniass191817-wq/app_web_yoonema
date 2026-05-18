<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'is_open' => 'boolean',
        'is_approved' => 'boolean',
        'opening_hours' => 'array',
        'delivery_time' => 'integer',
        'delivery_fee' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    protected $fillable = [
        'id',
        'name',
        'description',
        'address',
        'image_url',
        'cover_url',
        'owner_id',
        'rating',
        'is_open',
        'is_approved',
        'delivery_time',
        'delivery_fee',
        'opening_hours',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
