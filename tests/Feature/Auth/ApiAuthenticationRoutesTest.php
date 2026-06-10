<?php

use App\Models\User;

it('can authenticate through the api login route', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk();
    $response->assertJson([
        'two_factor' => false,
    ]);
    $this->assertAuthenticatedAs($user);
});

it('can register through the api registration route', function () {
    $response = $this->postJson('/api/register', [
        'firstname' => 'John',
        'lastname' => 'Doe',
        'email' => 'john@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
    ]);
    $this->assertAuthenticated();
});
