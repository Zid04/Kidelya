<?php

use App\Models\Role;
use App\Models\User;

it('retourne un token pour un admin avec des identifiants valides', function () {
    $role = Role::create(['type' => 'Admin']);
    $user = User::factory()->create([
        'idrole' => $role->idrole,
        'password' => bcrypt('password'),
    ]);

    $this->postJson('/api/admin/login', [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonStructure(['token', 'user']);
});

it('retourne 401 pour un mot de passe incorrect', function () {
    $role = Role::create(['type' => 'Admin']);
    $user = User::factory()->create(['idrole' => $role->idrole]);

    $this->postJson('/api/admin/login', [
        'email' => $user->email,
        'password' => 'mauvais-mdp',
    ])->assertStatus(401);
});

it('retourne 401 pour un email inexistant', function () {
    $this->postJson('/api/admin/login', [
        'email' => 'inexistant@example.com',
        'password' => 'password',
    ])->assertStatus(401);
});

it('retourne 403 pour un utilisateur non-admin', function () {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create([
        'idrole' => $role->idrole,
        'password' => bcrypt('password'),
    ]);

    $this->postJson('/api/admin/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertStatus(403);
});

it('retourne 401 sur une route protégée sans token', function () {
    $this->getJson('/api/activities')->assertUnauthorized();
});
