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
        $user->update(['is_available' => ! $user->is_available]);

        return response()->json(['success' => true, 'data' => $user, 'message' => 'Statut de l’utilisateur mis à jour.']);
    }
}
