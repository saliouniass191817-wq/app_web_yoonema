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
        'subtotal' => 'decimal:2',
        'platform_commission' => 'decimal:2',
        'vendor_amount' => 'decimal:2',
        'delivery_fee_student' => 'decimal:2',
        'delivery_fee_platform' => 'decimal:2',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
        'payout_processed' => 'boolean',
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
        'subtotal',
        'platform_commission',
        'vendor_amount',
        'delivery_fee_student',
        'delivery_fee_platform',
        'payment_status',
        'payment_method',
        'payment_reference',
        'paid_at',
        'payout_processed',
        'status',
        'delivery_address',
        'cancel_reason',
        'refused_reason',
        'cancelled_reason',
        'cancelled_by',
        'expires_at',
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
