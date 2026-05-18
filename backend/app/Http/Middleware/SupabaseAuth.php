<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\SupabaseService;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class SupabaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (! $header || ! str_starts_with($header, 'Bearer ')) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Token manquant.'], 401);
        }

        $token = trim(substr($header, 7));
        $supabaseUser = app(SupabaseService::class)->validateToken($token);

        if ($supabaseUser && ! empty($supabaseUser['id'])) {
            $user = User::query()->find($supabaseUser['id']);

            if (! $user && ! empty($supabaseUser['email'])) {
                $user = User::query()->where('email', $supabaseUser['email'])->first();
            }

            if ($user && $user->is_suspended) {
                return response()->json(['success' => false, 'data' => null, 'message' => 'Compte suspendu, contactez le support'], 403);
            }

            if ($user && $user->is_active) {
                auth()->setUser($user);

                return $next($request);
            }
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if ($accessToken && $accessToken->tokenable instanceof User && $accessToken->tokenable->is_suspended) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Compte suspendu, contactez le support'], 403);
        }

        if ($accessToken && $accessToken->tokenable instanceof User && $accessToken->tokenable->is_active) {
            $accessToken->forceFill(['last_used_at' => now()])->save();
            auth()->setUser($accessToken->tokenable);

            return $next($request);
        }

        return response()->json(['success' => false, 'data' => null, 'message' => 'Jeton invalide ou expiré.'], 401);
    }
}
