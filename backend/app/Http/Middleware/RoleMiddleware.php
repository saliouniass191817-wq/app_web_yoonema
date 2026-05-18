<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user();
        $aliases = [
            'etudiant' => 'student',
            'vendeur' => 'vendor',
            'livreur' => 'delivery',
        ];
        $expectedRole = $aliases[$role] ?? $role;

        if (! $user || $user->role !== $expectedRole) {
            return response()->json(['success' => false, 'message' => 'Acces non autorise.'], 403);
        }

        return $next($request);
    }
}
