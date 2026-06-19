<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect($frontendUrl.'/login?error=google_failed');
        }

        // Récupère ou crée l'utilisateur
        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'firstname' => $googleUser->offsetGet('given_name') ?? $googleUser->getName(),
                'lastname' => $googleUser->offsetGet('family_name') ?? '',
                'password' => Hash::make(Str::random(32)),
            ]
        );

        // Marque l'email comme vérifié si ce n'est pas déjà fait
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        $token = $user->createToken('google-auth')->plainTextToken;

        return redirect($frontendUrl.'/auth/callback?token='.urlencode($token));
    }
}
