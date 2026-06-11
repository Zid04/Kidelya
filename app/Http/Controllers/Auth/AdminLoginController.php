<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminLoginController extends Controller
{
  public function login(Request $request): JsonResponse
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)
                ->with('role')
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    }

    if ($user->role->type !== 'Admin') {
        return response()->json(['message' => 'Accès non autorisé'], 403);
    }

    $user->tokens()->delete();
    $token = $user->createToken('admin-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => $user
    ]);
}


public function register(Request $request): JsonResponse
{
    // Vérifie que l'utilisateur connecté est bien un admin
    $currentUser = $request->user();
    
    if (!$currentUser || $currentUser->role->type !== 'Admin') {
        return response()->json([
            'message' => 'Seul un admin peut créer un autre admin'
        ], 403);
    }

    $request->validate([
        'firstname' => 'required|string|max:50',
        'lastname'  => 'required|string|max:50',
        'email'     => 'required|email|unique:users,email',
        'password'  => 'required|string|min:8|confirmed',
    ]);

    $adminRole = \App\Models\Role::where('type', 'Admin')->first();

    $user = User::create([
        'firstname' => $request->firstname,
        'lastname'  => $request->lastname,
        'email'     => $request->email,
        'password'  => Hash::make($request->password),
        'is_active' => true,
        'idrole'    => $adminRole->idrole,
    ]);

    return response()->json([
        'message' => 'Admin créé avec succès',
        'data'    => $user->load('role')
    ], 201);
}
}