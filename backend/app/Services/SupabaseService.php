<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Arr;

class SupabaseService
{
    public function validateToken(string $token): ?array
    {
        try {
            $secret = config('services.supabase.jwt_secret');

            if (! $secret) {
                return null;
            }

            $payload = (array) JWT::decode($token, new Key($secret, 'HS256'));
            $metadata = (array) Arr::get($payload, 'user_metadata', []);

            return [
                'id' => $payload['sub'] ?? null,
                'email' => $payload['email'] ?? null,
                'role' => $metadata['role'] ?? $payload['role'] ?? null,
                'name' => $metadata['full_name'] ?? $metadata['name'] ?? null,
            ];
        } catch (\Throwable) {
            return null;
        }
    }
}
