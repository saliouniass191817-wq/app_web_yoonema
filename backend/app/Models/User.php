<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable, HasApiTokens, HasFactory, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_available' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'role',
        'address',
        'password',
        'avatar_url',
        'restaurant_id',
        'is_available',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function restaurant()
    {
        return $this->hasOne(Restaurant::class, 'owner_id');
    }

    public function selectedRestaurant()
    {
        return $this->belongsTo(Restaurant::class, 'restaurant_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'student_id');
    }

    public function deliveries()
    {
        return $this->hasMany(Order::class, 'delivery_person_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'student_id');
    }
}
