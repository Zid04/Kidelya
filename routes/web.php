<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleAuthController;

// Redirige / vers le frontend utilisateur
Route::get('/', function () {
    return redirect(config('app.frontend_url', 'http://localhost:5173'));
})->name('home');

// Route nommée 'dashboard' — requise par Fortify pour les redirections post-auth
Route::get('dashboard', function () {
    return redirect(config('app.frontend_url', 'http://localhost:5173') . '/dashboard');
})->name('dashboard');

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
