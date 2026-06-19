<?php

// ── Inscription ──────────────────────────────────────────────────────────────

it('un utilisateur peut s\'inscrire et reçoit un token', function () {
    // Le register hardcode idrole=3, on crée le rôle avec cet id
    DB::table('user_roles')->insert(['idrole' => 3, 'type' => 'User']);

    $this->postJson('/api/register', [
        'firstname' => 'Alice',
        'lastname' => 'Dupont',
        'email' => 'alice@example.com',
        'password' => 'password123',
    ])
        ->assertCreated()
        ->assertJsonStructure(['token', 'user']);

    $this->assertDatabaseHas('users', ['email' => 'alice@example.com']);
});

it('l\'inscription échoue si l\'email est déjà utilisé', function () {
    $user = userWithRole('User');

    $this->postJson('/api/register', [
        'firstname' => 'Bob',
        'lastname' => 'Martin',
        'email' => $user->email,
        'password' => 'password123',
    ])->assertUnprocessable();
});

it('l\'inscription échoue si les champs obligatoires sont absents', function () {
    $this->postJson('/api/register', [])->assertUnprocessable();
});

// ── Connexion ────────────────────────────────────────────────────────────────

it('un utilisateur peut se connecter et reçoit un token', function () {
    $user = userWithRole('User');

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonStructure(['token', 'user']);
});

it('la connexion échoue avec un mauvais mot de passe', function () {
    $user = userWithRole('User');

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'mauvais',
    ])->assertStatus(401);
});

it('la connexion échoue avec un email inexistant', function () {
    $this->postJson('/api/login', [
        'email' => 'personne@example.com',
        'password' => 'password',
    ])->assertStatus(401);
});

// ── Déconnexion ──────────────────────────────────────────────────────────────

it('un utilisateur connecté peut se déconnecter', function () {
    $user = userWithRole('User');
    $token = $user->createToken('test')->plainTextToken;

    $this->withToken($token)
        ->postJson('/api/logout')
        ->assertOk();
});

// ── Profil ───────────────────────────────────────────────────────────────────

it('GET /users/me retourne les données de l\'utilisateur connecté', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/users/me')
        ->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

it('GET /users/me retourne 401 sans token', function () {
    $this->getJson('/api/users/me')->assertUnauthorized();
});
