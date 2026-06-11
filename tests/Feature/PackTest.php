<?php

use App\Models\Activity;
use App\Models\Pack;

$packPayload = [
    'title'        => 'Pack Créativité',
    'description'  => 'Un pack pour les enfants créatifs',
    'tarification' => 19.99,
    'duration'     => 30,
    'is_published' => true,
    'type'         => 'credit_pack',
];

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les routes packs', function () {
    $this->getJson('/api/packs')->assertUnauthorized();
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un admin peut créer un pack', function () use ($packPayload) {
    $admin = userWithRole('Admin');

    $this->actingAs($admin, 'sanctum')
         ->postJson('/api/packs', $packPayload)
         ->assertCreated()
         ->assertJsonPath('data.title', 'Pack Créativité');

    $this->assertDatabaseHas('packs', ['title' => 'Pack Créativité']);
});

it('un utilisateur standard ne peut pas créer un pack', function () use ($packPayload) {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/packs', $packPayload)
         ->assertForbidden();
});

// ── Lecture ───────────────────────────────────────────────────────────────────

it('un admin peut lister les packs', function () {
    $admin = userWithRole('Admin');
    Pack::factory()->count(3)->create();

    $this->actingAs($admin, 'sanctum')
         ->getJson('/api/packs')
         ->assertOk()
         ->assertJsonStructure(['data']);
});

it('on peut voir un pack spécifique', function () {
    $admin = userWithRole('Admin');
    $pack  = Pack::factory()->create();

    $this->actingAs($admin, 'sanctum')
         ->getJson("/api/packs/{$pack->idpack}")
         ->assertOk()
         ->assertJsonPath('data.idpack', $pack->idpack);
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un admin peut modifier un pack', function () use ($packPayload) {
    $admin = userWithRole('Admin');
    $pack  = Pack::factory()->create();

    $this->actingAs($admin, 'sanctum')
         ->putJson("/api/packs/{$pack->idpack}", [
             ...$packPayload,
             'title' => 'Pack modifié',
         ])
         ->assertOk()
         ->assertJsonPath('data.title', 'Pack modifié');
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('un admin peut supprimer un pack', function () {
    $admin = userWithRole('Admin');
    $pack  = Pack::factory()->create();

    $this->actingAs($admin, 'sanctum')
         ->deleteJson("/api/packs/{$pack->idpack}")
         ->assertOk();

    $this->assertDatabaseMissing('packs', ['idpack' => $pack->idpack]);
});

// ── Publication ───────────────────────────────────────────────────────────────

it('un admin peut publier un pack', function () {
    $admin = userWithRole('Admin');
    $pack  = Pack::factory()->create(['is_published' => false]);

    $this->actingAs($admin, 'sanctum')
         ->patchJson("/api/packs/{$pack->idpack}/publish")
         ->assertOk();

    expect($pack->fresh()->is_published)->toBeTrue();
});

it('un admin peut dépublier un pack', function () {
    $admin = userWithRole('Admin');
    $pack  = Pack::factory()->create(['is_published' => true]);

    $this->actingAs($admin, 'sanctum')
         ->patchJson("/api/packs/{$pack->idpack}/unpublish")
         ->assertOk();

    expect($pack->fresh()->is_published)->toBeFalse();
});

// ── Gestion des activités dans un pack ───────────────────────────────────────

it('un admin peut ajouter une activité à un pack', function () {
    $admin    = userWithRole('Admin');
    $pack     = Pack::factory()->create();
    $activity = Activity::factory()->create();

    $this->actingAs($admin, 'sanctum')
         ->postJson("/api/packs/{$pack->idpack}/activities", [
             'activity_id' => $activity->idactivities,
         ])
         ->assertOk();

    $this->assertDatabaseHas('packs_activities', [
        'idpack'       => $pack->idpack,
        'idactivities' => $activity->idactivities,
    ]);
});

it('un admin peut retirer une activité d\'un pack', function () {
    $admin    = userWithRole('Admin');
    $pack     = Pack::factory()->create();
    $activity = Activity::factory()->create();
    $pack->activities()->attach($activity->idactivities);

    $this->actingAs($admin, 'sanctum')
         ->deleteJson("/api/packs/{$pack->idpack}/activities", [
             'activity_id' => $activity->idactivities,
         ])
         ->assertOk();

    $this->assertDatabaseMissing('packs_activities', [
        'idpack'       => $pack->idpack,
        'idactivities' => $activity->idactivities,
    ]);
});
