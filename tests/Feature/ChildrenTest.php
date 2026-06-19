<?php

use App\Models\Child;

$childPayload = [
    'firstname' => 'Alice',
    'lastname' => 'Dupont',
    'birthday' => '2019-03-15',
    'sexe' => 'female',
];

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les enfants', function () {
    $this->getJson('/api/children')->assertUnauthorized();
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer un enfant', function () use ($childPayload) {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/children', $childPayload)
        ->assertCreated()
        ->assertJsonPath('data.firstname', 'Alice');

    $this->assertDatabaseHas('children', [
        'firstname' => 'Alice',
        'iduser' => $user->iduser,
    ]);
});

it('la création échoue sans prénom', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/children', ['lastname' => 'Dupont'])
        ->assertUnprocessable();
});

// ── Lecture ──────────────────────────────────────────────────────────────────

it('un utilisateur ne voit que ses propres enfants', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');

    Child::factory()->count(2)->create(['iduser' => $userA->iduser]);
    Child::factory()->count(3)->create(['iduser' => $userB->iduser]);

    $response = $this->actingAs($userA, 'sanctum')
        ->getJson('/api/children')
        ->assertOk();

    expect($response->json('data'))->toHaveCount(2);
});

it('un utilisateur peut voir le détail d\'un de ses enfants', function () {
    $user = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/children/{$child->idchildren}")
        ->assertOk()
        ->assertJsonPath('data.idchildren', $child->idchildren);
});

it('un utilisateur ne peut pas voir l\'enfant d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $userA->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->getJson("/api/children/{$child->idchildren}")
        ->assertForbidden();
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un utilisateur peut modifier son enfant', function () use ($childPayload) {
    $user = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/children/{$child->idchildren}", [
            ...$childPayload,
            'firstname' => 'Béatrice',
        ])
        ->assertOk()
        ->assertJsonPath('data.firstname', 'Béatrice');
});

it('un utilisateur ne peut pas modifier l\'enfant d\'un autre', function () use ($childPayload) {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $userA->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->putJson("/api/children/{$child->idchildren}", $childPayload)
        ->assertForbidden();
});

// ── Suppression ──────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer son enfant', function () {
    $user = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/children/{$child->idchildren}")
        ->assertOk();

    $this->assertDatabaseMissing('children', ['idchildren' => $child->idchildren]);
});

it('un utilisateur ne peut pas supprimer l\'enfant d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $child = Child::factory()->create(['iduser' => $userA->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->deleteJson("/api/children/{$child->idchildren}")
        ->assertForbidden();
});
