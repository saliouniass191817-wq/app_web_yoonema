<?php

return [
    'commission_rate' => env('YOONEMA_COMMISSION_RATE', 0.09),
    'delivery_fee_per_unit' => env('YOONEMA_DELIVERY_FEE_PER_UNIT', 200),
    'cancellation_window_minutes' => env('YOONEMA_CANCELLATION_WINDOW_MINUTES', 5),
    'order_expiry_minutes' => env('YOONEMA_ORDER_EXPIRY_MINUTES', 15),
    'delivery_fee_platform_rate' => env('YOONEMA_DELIVERY_FEE_PLATFORM_RATE', 1),
    'max_active_orders' => env('YOONEMA_MAX_ACTIVE_ORDERS', 2),
    'max_orders_per_day' => env('YOONEMA_MAX_ORDERS_PER_DAY', 10),
    'order_cooldown_minutes' => env('YOONEMA_ORDER_COOLDOWN_MINUTES', 2),
];
