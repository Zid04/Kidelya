<?php

use App\Models\Activity;

$payload = [
    'title' => 'Activité peinture',
    'agemin' => 3,
    'agemax' => 8,
    'duration' => 45,
];

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer une activité', function () use ($payload) {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/activities', $payload)
        ->assertCreated()
        ->assertJsonPath('data.title', 'Activité peinture');

    $this->assertDatabaseHas('activities', [
        'title' => 'Activité peinture',
        'iduser' => $user->iduser,
    ]);
});

it('la création échoue sans titre', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/activities', ['agemin' => 3])
        ->assertUnprocessable();
});

// ── Lecture ──────────────────────────────────────────────────────────────────

it('GET /activities/mine retourne uniquement les activités de l\'utilisateur', function () {
    $owner = userWithRole('User');
    $other = userWithRole('User');

    Activity::factory()->create(['iduser' => $owner->iduser]);
    Activity::factory()->create(['iduser' => $owner->iduser]);
    Activity::factory()->create(['iduser' => $other->iduser]);

    $response = $this->actingAs($owner, 'sanctum')
        ->getJson('/api/activities/mine')
        ->assertOk();

    expect($response->json('data'))->toHaveCount(2);
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un utilisateur peut modifier sa propre activité', function () use ($payload) {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/activities/{$activity->idactivities}", [
            ...$payload,
            'title' => 'Titre modifié',
        ])
        ->assertOk()
        ->assertJsonPath('data.title', 'Titre modifié');
});

it('un utilisateur ne peut pas modifier l\'activité d\'un autre', function () use ($payload) {
    $owner = userWithRole('User');
    $intruder = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($intruder, 'sanctum')
        ->putJson("/api/activities/{$activity->idactivities}", $payload)
        ->assertForbidden();
});

// ── Suppression ──────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer sa propre activité', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/activities/{$activity->idactivities}")
        ->assertOk();

    $this->assertSoftDeleted('activities', ['idactivities' => $activity->idactivities]);
});

it('un utilisateur ne peut pas supprimer l\'activité d\'un autre', function () {
    $owner = userWithRole('User');
    $intruder = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($intruder, 'sanctum')
        ->deleteJson("/api/activities/{$activity->idactivities}")
        ->assertForbidden();
});

// ── Publication ───────────────────────────────────────────────────────────────

it('un utilisateur peut publier sa propre activité', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => false]);

    $this->actingAs($user, 'sanctum')
        ->patchJson("/api/activities/{$activity->idactivities}/publish")
        ->assertOk();

    expect($activity->fresh()->is_published)->toBeTrue();
});

it('un utilisateur peut dépublier sa propre activité', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => true]);

    $this->actingAs($user, 'sanctum')
        ->patchJson("/api/activities/{$activity->idactivities}/unpublish")
        ->assertOk();

    expect($activity->fresh()->is_published)->toBeFalse();
});

it('un utilisateur ne peut pas publier l\'activité d\'un autre', function () {
    $owner = userWithRole('User');
    $intruder = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($intruder, 'sanctum')
        ->patchJson("/api/activities/{$activity->idactivities}/publish")
        ->assertForbidden();
});

// ── Admin ────────────────────────────────────────────────────────────────────

it('un admin peut supprimer l\'activité de n\'importe quel utilisateur', function () {
    $owner = userWithRole('User');
    $admin = userWithRole('Admin');
    $activity = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($admin, 'sanctum')
        ->deleteJson("/api/activities/{$activity->idactivities}")
        ->assertOk();

    $this->assertSoftDeleted('activities', ['idactivities' => $activity->idactivities]);
});
