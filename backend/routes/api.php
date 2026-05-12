<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminRestaurantController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Delivery\DeliveryController;
use App\Http\Controllers\Api\Student\OrderController as StudentOrderController;
use App\Http\Controllers\Api\Student\RestaurantController as StudentRestaurantController;
use App\Http\Controllers\Api\Student\ReviewController;
use App\Http\Controllers\Api\Vendor\MenuController;
use App\Http\Controllers\Api\Vendor\RestaurantController as VendorRestaurantController;
use App\Http\Controllers\Api\Vendor\VendorOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register/student', [AuthController::class, 'registerStudent']);
        Route::post('register/vendor', [AuthController::class, 'registerVendor']);
        Route::post('register/delivery', [AuthController::class, 'registerDelivery']);
        Route::post('forgot-password', [PasswordResetController::class, 'forgot']);
        Route::post('reset-password', [PasswordResetController::class, 'reset']);
    });

    Route::middleware(['supabase.auth'])->prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    Route::middleware(['supabase.auth'])->group(function () {
        Route::middleware(['role:student'])->group(function () {
            Route::get('restaurants', [StudentRestaurantController::class, 'index']);
            Route::get('restaurants/{restaurant}', [StudentRestaurantController::class, 'show']);
            Route::get('restaurants/{restaurant}/menu', [StudentRestaurantController::class, 'menu']);
            Route::get('delivery-persons', [StudentRestaurantController::class, 'availableDeliveryPersons']);
            Route::post('orders', [StudentOrderController::class, 'store']);
            Route::get('orders', [StudentOrderController::class, 'index']);
            Route::get('orders/{order}', [StudentOrderController::class, 'show']);
            Route::post('orders/{order}/cancel', [StudentOrderController::class, 'cancel']);
            Route::post('reviews', [ReviewController::class, 'store']);
        });

        Route::middleware(['role:etudiant'])->prefix('etudiant')->group(function () {
            Route::get('restaurants', [StudentRestaurantController::class, 'index']);
            Route::get('restaurants/{restaurant}', [StudentRestaurantController::class, 'show']);
            Route::get('restaurants/{restaurant}/menu', [StudentRestaurantController::class, 'menu']);
            Route::get('delivery-persons', [StudentRestaurantController::class, 'availableDeliveryPersons']);
            Route::post('orders', [StudentOrderController::class, 'store']);
            Route::get('orders', [StudentOrderController::class, 'index']);
            Route::get('orders/{order}', [StudentOrderController::class, 'show']);
            Route::post('orders/{order}/cancel', [StudentOrderController::class, 'cancel']);
            Route::post('reviews', [ReviewController::class, 'store']);
        });

        Route::middleware(['role:vendor'])->prefix('vendor')->group(function () {
            Route::get('restaurant', [VendorRestaurantController::class, 'show']);
            Route::put('restaurant', [VendorRestaurantController::class, 'update']);
            Route::get('menu', [MenuController::class, 'index']);
            Route::post('menu', [MenuController::class, 'store']);
            Route::put('menu/{menuItem}', [MenuController::class, 'update']);
            Route::delete('menu/{menuItem}', [MenuController::class, 'destroy']);
            Route::get('orders', [VendorOrderController::class, 'index']);
            Route::put('orders/{order}/status', [VendorOrderController::class, 'updateStatus']);
            Route::post('orders/{order}/refuse', [VendorOrderController::class, 'refuse']);
            Route::get('stats', [VendorOrderController::class, 'stats']);
        });

        Route::middleware(['role:vendeur'])->prefix('vendeur')->group(function () {
            Route::get('restaurant', [VendorRestaurantController::class, 'show']);
            Route::put('restaurant', [VendorRestaurantController::class, 'update']);
            Route::get('menu', [MenuController::class, 'index']);
            Route::post('menu', [MenuController::class, 'store']);
            Route::put('menu/{menuItem}', [MenuController::class, 'update']);
            Route::delete('menu/{menuItem}', [MenuController::class, 'destroy']);
            Route::get('orders', [VendorOrderController::class, 'index']);
            Route::put('orders/{order}/status', [VendorOrderController::class, 'updateStatus']);
            Route::post('orders/{order}/refuse', [VendorOrderController::class, 'refuse']);
            Route::get('stats', [VendorOrderController::class, 'stats']);
        });

        Route::middleware(['role:delivery'])->prefix('delivery')->group(function () {
            Route::get('orders', [DeliveryController::class, 'available']);
            Route::put('orders/{order}/accept', [DeliveryController::class, 'accept']);
            Route::post('orders/{order}/refuse', [DeliveryController::class, 'refuse']);
            Route::put('orders/{order}/delivered', [DeliveryController::class, 'delivered']);
            Route::get('history', [DeliveryController::class, 'history']);
            Route::put('availability', [DeliveryController::class, 'availability']);
        });

        Route::middleware(['role:livreur'])->prefix('livreur')->group(function () {
            Route::get('orders', [DeliveryController::class, 'available']);
            Route::put('orders/{order}/accept', [DeliveryController::class, 'accept']);
            Route::post('orders/{order}/refuse', [DeliveryController::class, 'refuse']);
            Route::put('orders/{order}/delivered', [DeliveryController::class, 'delivered']);
            Route::get('history', [DeliveryController::class, 'history']);
            Route::put('availability', [DeliveryController::class, 'availability']);
        });

        Route::middleware(['role:admin'])->prefix('admin')->group(function () {
            Route::get('stats', [AdminDashboardController::class, 'index']);
            Route::get('restaurants', [AdminRestaurantController::class, 'index']);
            Route::put('restaurants/{restaurant}/approve', [AdminRestaurantController::class, 'approve']);
            Route::put('restaurants/{restaurant}/reject', [AdminRestaurantController::class, 'reject']);
            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('users', [AdminUserController::class, 'index']);
            Route::put('users/{user}/toggle', [AdminUserController::class, 'toggle']);
            Route::get('notifications', [AdminDashboardController::class, 'notifications']);
        });
    });
});
