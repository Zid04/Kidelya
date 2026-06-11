<?php

use App\Models\Activity;
use App\Models\Idea;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les idées', function () {
    $this->getJson('/api/ideas')->assertUnauthorized();
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer une idée', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/ideas', ['title' => 'Idée de sortie au zoo'])
         ->assertCreated()
         ->assertJsonPath('data.title', 'Idée de sortie au zoo');

    $this->assertDatabaseHas('ideas', [
        'title'  => 'Idée de sortie au zoo',
        'iduser' => $user->iduser,
    ]);
});

it('la création échoue sans titre', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/ideas', [])
         ->assertUnprocessable()
         ->assertJsonValidationErrors(['title']);
});

it('un utilisateur peut créer une idée avec des notes', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/ideas', [
             'title' => 'Atelier dessin',
             'notes' => 'Prévoir des feutres et du papier A3.',
         ])
         ->assertCreated()
         ->assertJsonPath('data.notes', 'Prévoir des feutres et du papier A3.');
});

// ── Liste ────────────────────────────────────────────────────────────────────

it('un utilisateur voit uniquement ses propres idées', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');

    Idea::factory()->create(['title' => 'Idée de A', 'iduser' => $userA->iduser]);
    Idea::factory()->create(['title' => 'Idée de B', 'iduser' => $userB->iduser]);

    $response = $this->actingAs($userA, 'sanctum')
                     ->getJson('/api/ideas')
                     ->assertOk();

    $titles = collect($response->json('data'))->pluck('title');

    expect($titles)->toContain('Idée de A')
                   ->not->toContain('Idée de B');
});

// ── Détail ────────────────────────────────────────────────────────────────────

it('un utilisateur peut voir le détail de sa propre idée', function () {
    $user = userWithRole('User');
    $idea = Idea::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/ideas/{$idea->ididea}")
         ->assertOk()
         ->assertJsonPath('data.ididea', $idea->ididea);
});

it('un utilisateur ne peut pas voir l\'idée d\'un autre', function () {
    $owner = userWithRole('User');
    $other = userWithRole('User');
    $idea  = Idea::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($other, 'sanctum')
         ->getJson("/api/ideas/{$idea->ididea}")
         ->assertForbidden();
});

// ── Modification ─────────────────────────────────────────────────────────────

it('un utilisateur peut modifier sa propre idée', function () {
    $user = userWithRole('User');
    $idea = Idea::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->putJson("/api/ideas/{$idea->ididea}", ['title' => 'Nouveau titre'])
         ->assertOk()
         ->assertJsonPath('data.title', 'Nouveau titre');

    $this->assertDatabaseHas('ideas', [
        'ididea' => $idea->ididea,
        'title'  => 'Nouveau titre',
    ]);
});

it('un utilisateur ne peut pas modifier l\'idée d\'un autre', function () {
    $owner = userWithRole('User');
    $other = userWithRole('User');
    $idea  = Idea::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($other, 'sanctum')
         ->putJson("/api/ideas/{$idea->ididea}", ['title' => 'Modif non autorisée'])
         ->assertForbidden();
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer sa propre idée', function () {
    $user = userWithRole('User');
    $idea = Idea::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->deleteJson("/api/ideas/{$idea->ididea}")
         ->assertOk();

    $this->assertDatabaseMissing('ideas', ['ididea' => $idea->ididea]);
});

it('un utilisateur ne peut pas supprimer l\'idée d\'un autre', function () {
    $owner = userWithRole('User');
    $other = userWithRole('User');
    $idea  = Idea::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($other, 'sanctum')
         ->deleteJson("/api/ideas/{$idea->ididea}")
         ->assertForbidden();
});

// ── Conversion en activité ────────────────────────────────────────────────────

it('un utilisateur peut convertir son idée en brouillon d\'activité', function () {
    $user = userWithRole('User');
    $idea = Idea::factory()->create([
        'title'  => 'Atelier poterie',
        'notes'  => 'Matériel : argile, tournette.',
        'iduser' => $user->iduser,
    ]);

    $this->actingAs($user, 'sanctum')
         ->postJson("/api/ideas/{$idea->ididea}/convert")
         ->assertStatus(201)
         ->assertJsonPath('data.title', 'Atelier poterie')
         ->assertJsonPath('data.description', 'Matériel : argile, tournette.')
         ->assertJsonPath('data.is_published', false);

    // L'idée est supprimée après conversion
    $this->assertDatabaseMissing('ideas', ['ididea' => $idea->ididea]);

    // L'activité brouillon est créée et appartient à l'utilisateur
    $this->assertDatabaseHas('activities', [
        'title'        => 'Atelier poterie',
        'iduser'       => $user->iduser,
        'is_published' => false,
    ]);
});

it('la conversion préserve le titre et les notes de l\'idée', function () {
    $user = userWithRole('User');
    $idea = Idea::factory()->create([
        'title'  => 'Visite musée',
        'notes'  => 'Réserver les billets à l\'avance.',
        'iduser' => $user->iduser,
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->postJson("/api/ideas/{$idea->ididea}/convert")
                     ->assertCreated();

    $activity = Activity::find($response->json('data.idactivities'));

    expect($activity->title)->toBe('Visite musée')
        ->and($activity->description)->toBe('Réserver les billets à l\'avance.')
        ->and((bool) $activity->is_published)->toBeFalse()
        ->and((bool) $activity->is_purchasable)->toBeFalse();
});

it('un utilisateur ne peut pas convertir l\'idée d\'un autre', function () {
    $owner = userWithRole('User');
    $other = userWithRole('User');
    $idea  = Idea::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($other, 'sanctum')
         ->postJson("/api/ideas/{$idea->ididea}/convert")
         ->assertForbidden();

    // L'idée doit toujours exister
    $this->assertDatabaseHas('ideas', ['ididea' => $idea->ididea]);
});

it('la conversion sans auth retourne 401', function () {
    $idea = Idea::factory()->create();

    $this->postJson("/api/ideas/{$idea->ididea}/convert")
         ->assertUnauthorized();
});
