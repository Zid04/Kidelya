<?php

use App\Models\Child;
use App\Models\Guardian;

$guardianPayload = [
    'names' => 'Marie Dupont',
    'email' => 'marie@example.com',
    'phone' => '0612345678',
    'address' => '12 rue de la Paix, Paris',
];

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les parents', function () {
    $this->getJson('/api/guardians')->assertUnauthorized();
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer un parent', function () use ($guardianPayload) {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/guardians', $guardianPayload)
        ->assertCreated()
        ->assertJsonPath('data.names', 'Marie Dupont');

    $this->assertDatabaseHas('parents', ['email' => 'marie@example.com']);
});

it('la création échoue sans champs obligatoires', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/guardians', [])
        ->assertUnprocessable();
});

// ── Lecture ───────────────────────────────────────────────────────────────────

it('un utilisateur peut voir la liste des parents', function () {
    $user = userWithRole('User');
    Guardian::factory()->count(2)->create(['user_id' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/guardians')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

it('un utilisateur peut voir le détail d\'un parent', function () {
    $user = userWithRole('User');
    $guardian = Guardian::factory()->create(['user_id' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/guardians/{$guardian->getKey()}")
        ->assertOk()
        ->assertJsonPath('data.idparent', $guardian->getKey());
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un utilisateur peut modifier un parent', function () use ($guardianPayload) {
    $user = userWithRole('User');
    $guardian = Guardian::factory()->create(['user_id' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/guardians/{$guardian->getKey()}", [
            ...$guardianPayload,
            'names' => 'Pierre Martin',
        ])
        ->assertOk()
        ->assertJsonPath('data.names', 'Pierre Martin');
});

// ── Suppression ──────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer un parent', function () {
    $user = userWithRole('User');
    $guardian = Guardian::factory()->create(['user_id' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/guardians/{$guardian->getKey()}")
        ->assertOk();

    $this->assertDatabaseMissing('parents', ['idparent' => $guardian->getKey()]);
});

// ── Gestion des enfants d'un parent ──────────────────────────────────────────

it('on peut ajouter un enfant à un parent', function () {
    $user = userWithRole('User');
    $guardian = Guardian::factory()->create(['user_id' => $user->iduser]);
    $child = Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->postJson("/api/guardians/{$guardian->getKey()}/children", [
            'child_id' => $child->idchildren,
        ])
        ->assertOk();

    $this->assertDatabaseHas('children_parents', [
        'idparent' => $guardian->getKey(),
        'idchildren' => $child->idchildren,
    ]);
});

it('on peut retirer un enfant d\'un parent', function () {
    $user = userWithRole('User');
    $guardian = Guardian::factory()->create(['user_id' => $user->iduser]);
    $child = Child::factory()->create(['iduser' => $user->iduser]);
    $guardian->children()->attach($child->idchildren);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/guardians/{$guardian->getKey()}/children", [
            'child_id' => $child->idchildren,
        ])
        ->assertOk();

    $this->assertDatabaseMissing('children_parents', [
        'idparent' => $guardian->getKey(),
        'idchildren' => $child->idchildren,
    ]);
});
