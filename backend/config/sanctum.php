<?php

$frontendHost = parse_url(env('FRONTEND_URL', 'http://localhost:5173'), PHP_URL_HOST);
$frontendPort = parse_url(env('FRONTEND_URL', 'http://localhost:5173'), PHP_URL_PORT);
$frontendDomain = $frontendHost ? $frontendHost.($frontendPort ? ':'.$frontendPort : '') : null;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', implode(',', array_filter([
        'localhost',
        'localhost:5173',
        '127.0.0.1',
        '127.0.0.1:5173',
        $frontendHost,
        $frontendDomain,
    ])))),

    'guard' => ['web'],
    'expiration' => null,
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
