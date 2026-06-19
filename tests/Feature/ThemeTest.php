<?php

use App\Models\Activity;
use App\Models\Theme;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les thèmes', function () {
    $this->getJson('/api/themes')->assertUnauthorized();
});

// ── Liste ────────────────────────────────────────────────────────────────────

it('un utilisateur peut lister les thèmes', function () {
    $user = userWithRole('User');
    Theme::factory()->create(['name' => 'Nature']);

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/themes')
        ->assertOk()
        ->assertJsonFragment(['name' => 'Nature']);
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer un thème', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/themes', ['name' => 'Science'])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Science');

    $this->assertDatabaseHas('themes', ['name' => 'Science']);
});

it('la création échoue sans nom', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/themes', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('la création échoue avec un nom dupliqué', function () {
    $user = userWithRole('User');
    Theme::factory()->create(['name' => 'Sport']);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/themes', ['name' => 'Sport'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

// ── Détail ────────────────────────────────────────────────────────────────────

it('un utilisateur peut voir un thème', function () {
    $user = userWithRole('User');
    $theme = Theme::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/themes/{$theme->idtheme}")
        ->assertOk()
        ->assertJsonPath('data.idtheme', $theme->idtheme);
});

// ── Modification ─────────────────────────────────────────────────────────────

it('un utilisateur peut modifier un thème', function () {
    $user = userWithRole('User');
    $theme = Theme::factory()->create(['name' => 'Ancien nom']);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/themes/{$theme->idtheme}", ['name' => 'Nouveau nom'])
        ->assertOk()
        ->assertJsonPath('data.name', 'Nouveau nom');

    $this->assertDatabaseHas('themes', ['idtheme' => $theme->idtheme, 'name' => 'Nouveau nom']);
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer un thème', function () {
    $user = userWithRole('User');
    $theme = Theme::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/themes/{$theme->idtheme}")
        ->assertOk();

    $this->assertDatabaseMissing('themes', ['idtheme' => $theme->idtheme]);
});

// ── Activités liées ───────────────────────────────────────────────────────────

it('un utilisateur peut ajouter une activité à un thème', function () {
    $user = userWithRole('User');
    $theme = Theme::factory()->create();
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->postJson("/api/themes/{$theme->idtheme}/activities", [
            'activity_id' => $activity->idactivities,
        ])
        ->assertOk();

    $this->assertDatabaseHas('themes_activities', [
        'idtheme' => $theme->idtheme,
        'idactivities' => $activity->idactivities,
    ]);
});

it('un utilisateur peut retirer une activité d\'un thème', function () {
    $user = userWithRole('User');
    $theme = Theme::factory()->create();
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);
    $theme->activities()->attach($activity->idactivities);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/themes/{$theme->idtheme}/activities", [
            'activity_id' => $activity->idactivities,
        ])
        ->assertOk();

    $this->assertDatabaseMissing('themes_activities', [
        'idtheme' => $theme->idtheme,
        'idactivities' => $activity->idactivities,
    ]);
});
