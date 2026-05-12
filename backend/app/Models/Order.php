<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'items' => 'array',
        'total_amount' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
    ];

    protected $fillable = [
        'id',
        'student_id',
        'restaurant_id',
        'restaurant_name',
        'delivery_person_id',
        'items',
        'total_amount',
        'delivery_fee',
        'status',
        'delivery_address',
        'cancel_reason',
        'cancelled_by',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function deliveryPerson()
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
