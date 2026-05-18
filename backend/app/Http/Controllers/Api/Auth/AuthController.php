<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterDeliveryRequest;
use App\Http\Requests\RegisterStudentRequest;
use App\Http\Requests\RegisterVendorRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Identifiants invalides.'], 401);
        }

        if ($user->is_suspended) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Compte suspendu, contactez le support'], 403);
        }

        if (! $user->is_active) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Ce compte est désactivé.'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    public function registerStudent(RegisterStudentRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['id'] = (string) Str::uuid();
        $payload['role'] = 'student';
        $payload['password'] = Hash::make($payload['password']);

        $user = User::query()->create($payload);
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Étudiant créé avec succès.',
            'data' => ['user' => $user, 'token' => $token],
        ], 201);
    }

    public function registerVendor(RegisterVendorRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['id'] = (string) Str::uuid();
        $payload['role'] = 'vendor';
        $payload['password'] = Hash::make($payload['password']);

        $user = User::query()->create($payload);
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Vendeur créé avec succès.',
            'data' => ['user' => $user, 'token' => $token],
        ], 201);
    }

    public function registerDelivery(RegisterDeliveryRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['id'] = (string) Str::uuid();
        $payload['role'] = 'delivery';
        $payload['is_available'] = true;
        $payload['password'] = Hash::make($payload['password']);

        $user = User::query()->create($payload);
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Livreur créé avec succès.',
            'data' => ['user' => $user, 'token' => $token],
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['success' => true, 'data' => null, 'message' => 'Déconnexion réussie.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['user' => $request->user()], 'message' => 'Profil récupéré.']);
    }
}
