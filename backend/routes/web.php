<?php

use App\Models\Restaurant;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $restaurants = Restaurant::query()
        ->with(['menuItems' => fn ($query) => $query->where('is_available', true)->orderBy('name')])
        ->where('is_approved', true)
        ->orderByDesc('rating')
        ->take(6)
        ->get();

    $stats = [
        'restaurants' => Restaurant::query()->where('is_approved', true)->count(),
        'open' => Restaurant::query()->where('is_approved', true)->where('is_open', true)->count(),
        'menus' => Restaurant::query()->where('is_approved', true)->withCount('menuItems')->get()->sum('menu_items_count'),
    ];

    return view('welcome', compact('restaurants', 'stats'));
});
