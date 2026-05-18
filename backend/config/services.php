<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'key' => env('SUPABASE_KEY'),
        'jwt_secret' => env('SUPABASE_JWT_SECRET'),
        'storage_bucket' => env('SUPABASE_STORAGE_BUCKET', 'yoonema-images'),
        'sync_enabled' => env('SUPABASE_SYNC_ENABLED', true),
    ],

    'cinetpay' => [
        'api_key' => env('CINETPAY_API_KEY'),
        'site_id' => env('CINETPAY_SITE_ID'),
        'secret' => env('CINETPAY_SECRET'),
        'payment_url' => env('CINETPAY_PAYMENT_URL', 'https://api-checkout.cinetpay.com/v2/payment'),
        'verify_url' => env('CINETPAY_VERIFY_URL', 'https://api-checkout.cinetpay.com/v2/payment/check'),
    ],

];
