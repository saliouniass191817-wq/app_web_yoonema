<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * VERSION SIMPLE (compatibilité ancienne)
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'restaurants' => Restaurant::count(),
                'orders' => Order::count(),
                'users' => User::count(),
                'pending_restaurants' => Restaurant::where('is_approved', false)->count(),
                'active_delivery_persons' => User::where('role', 'delivery')
                    ->where('is_available', true)
                    ->count(),
            ],
            'message' => 'Statistiques simples récupérées.'
        ]);
    }

    /**
     * VERSION AVANCÉE (dashboard React complet)
     */
    public function stats(): JsonResponse
    {
        $now = Carbon::now();
        $startMonth = $now->copy()->startOfMonth();
        $lastMonth = $now->copy()->subMonth()->startOfMonth();
        $endLastMonth = $now->copy()->subMonth()->endOfMonth();

        // USERS
        $totalUsers = User::count();
        $usersThisMonth = User::where('created_at', '>=', $startMonth)->count();
        $usersLastMonth = User::whereBetween('created_at', [$lastMonth, $endLastMonth])->count();
        $usersByRole = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');
            

        // RESTAURANTS
        $totalRestaurants = Restaurant::count();
        $pendingRestaurants = Restaurant::where('is_approved', false)->count();
        $openRestaurants = Restaurant::where('is_open', true)
            ->where('is_approved', true)->count();

        // ORDERS
        $totalOrders = Order::count();
        $ordersThisMonth = Order::where('created_at', '>=', $startMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$lastMonth, $endLastMonth])->count();
        $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $todayOrders = Order::whereDate('created_at', today())->count();
        $activeOrders = Order::whereIn('status', [
            'pending', 'confirmed', 'preparing', 'ready', 'delivering'
        ])->count();

        // REVENUE
        $revenueThisMonth = Order::where('status', 'delivered')
            ->where('created_at', '>=', $startMonth)
            ->sum('total_amount');

        $revenueLastMonth = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$lastMonth, $endLastMonth])
            ->sum('total_amount');

        $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');

        $todayRevenue = Order::where('status', 'delivered')
            ->whereDate('created_at', today())
            ->sum('total_amount');

        // DELIVERY
        $totalDelivery = User::where('role', 'delivery')->count();
        $availableDelivery = User::where('role', 'delivery')
            ->where('is_available', true)->count();

        // GROWTH
        $userGrowth = $this->growthRate($usersLastMonth, $usersThisMonth);
        $orderGrowth = $this->growthRate($ordersLastMonth, $ordersThisMonth);
        $revenueGrowth = $this->growthRate($revenueLastMonth, $revenueThisMonth);

        // CHART REVENUE
        $revenueChart = Order::where('status', 'delivered')
            ->where('created_at', '>=', $now->copy()->subDays(6))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date' => Carbon::parse($row->date)->format('d/m'),
                'revenue' => (float) $row->revenue,
            ]);

        // STATUS
        $statusLabels = [
            'pending' => 'En attente',
            'confirmed' => 'Confirmée',
            'preparing' => 'En préparation',
            'ready' => 'Prête',
            'delivering' => 'En livraison',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
            'refused' => 'Refusée',
            'expired' => 'Expirée',
        ];

        $ordersChart = collect($ordersByStatus)->map(fn($total, $status) => [
            'status' => $status,
            'label' => $statusLabels[$status] ?? $status,
            'total' => $total,
        ])->values();

        // TOP RESTAURANTS
        $topRestaurants = Order::where('status', 'delivered')
            ->where('created_at', '>=', $startMonth)
            ->select(
                'restaurant_id',
                'restaurant_name',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('restaurant_id', 'restaurant_name')
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get();

        // TASKS
        $pendingTasks = [
            [
                'type' => 'restaurants',
                'label' => 'Restaurant(s) à valider',
                'count' => $pendingRestaurants,
                'icon' => '🍴',
                'url' => '/admin/restaurants?filter=pending',
                'urgent' => $pendingRestaurants > 0,
            ],
            [
                'type' => 'orders',
                'label' => 'Commande(s) active(s)',
                'count' => $activeOrders,
                'icon' => '📦',
                'url' => '/admin/orders?filter=active',
                'urgent' => false,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'users' => [
                    'total' => $totalUsers,
                    'this_month' => $usersThisMonth,
                    'growth' => $userGrowth,
                    'by_role' => $usersByRole,
                ],
                'restaurants' => [
                    'total' => $totalRestaurants,
                    'pending' => $pendingRestaurants,
                    'open' => $openRestaurants,
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'today' => $todayOrders,
                    'active' => $activeOrders,
                    'this_month' => $ordersThisMonth,
                    'growth' => $orderGrowth,
                    'by_status' => $ordersChart,
                ],
                'revenue' => [
                    'total' => (float) $totalRevenue,
                    'today' => (float) $todayRevenue,
                    'this_month' => (float) $revenueThisMonth,
                    'growth' => $revenueGrowth,
                    'chart' => $revenueChart,
                ],
                'delivery' => [
                    'total' => $totalDelivery,
                    'available' => $availableDelivery,
                ],
                'top_restaurants' => $topRestaurants,
                'pending_tasks' => $pendingTasks,
            ],
        ]);
    }

    private function growthRate(float $previous, float $current): float
    {
        if ($previous === 0.0) return $current > 0 ? 100.0 : 0.0;
        return round((($current - $previous) / $previous) * 100, 1);
    }

    public function notifications(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Notification::latest()->limit(50)->get()
        ]);
    }
}