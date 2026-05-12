<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $data = [
            'restaurants' => Restaurant::count(),
            'orders' => Order::count(),
            'users' => User::count(),
            'pending_restaurants' => Restaurant::where('is_approved', false)->count(),
            'active_delivery_persons' => User::where('role', 'delivery')->where('is_available', true)->count(),
        ];

        return response()->json(['success' => true, 'data' => $data, 'message' => 'Statistiques d’administration récupérées.']);
    }

    public function notifications(): JsonResponse
    {
        $notifications = Notification::latest()->limit(50)->get();

        return response()->json(['success' => true, 'data' => $notifications, 'message' => 'Notifications récupérées.']);
    }
}
