<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'restaurant_rating' => 'integer',
        'delivery_rating' => 'integer',
    ];

    protected $fillable = [
        'id',
        'student_id',
        'order_id',
        'restaurant_id',
        'delivery_person_id',
        'restaurant_rating',
        'delivery_rating',
        'comment',
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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
