<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::when($request->filled('role'), fn ($query) => $query->where('role', $request->input('role')))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $users, 'message' => 'Utilisateurs récupérés.']);
    }

    public function toggle(User $user): JsonResponse
    {
        $user->update(['is_active' => ! $user->is_active]);

        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json(['success' => true, 'data' => $user->fresh(), 'message' => 'Statut de l’utilisateur mis à jour.']);
    }

    public function suspend(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update([
            'is_suspended' => true,
            'suspension_reason' => $validated['reason'] ?? null,
        ]);

        $user->tokens()->delete();

        return response()->json(['success' => true, 'data' => $user->fresh(), 'message' => 'Compte suspendu.']);
    }

    public function unsuspend(User $user): JsonResponse
    {
        $user->update([
            'is_suspended' => false,
            'suspension_reason' => null,
        ]);

        return response()->json(['success' => true, 'data' => $user->fresh(), 'message' => 'Compte réactivé.']);
    }
}
