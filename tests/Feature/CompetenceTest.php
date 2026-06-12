<?php

use App\Models\Activity;
use App\Models\Competence;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les compétences', function () {
    $this->getJson('/api/competences')->assertUnauthorized();
});

// ── Liste ────────────────────────────────────────────────────────────────────

it('un utilisateur peut lister les compétences', function () {
    $user = userWithRole('User');
    Competence::factory()->create(['name' => 'Créativité']);

    $this->actingAs($user, 'sanctum')
         ->getJson('/api/competences')
         ->assertOk()
         ->assertJsonFragment(['name' => 'Créativité']);
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer une compétence', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/competences', ['name' => 'Autonomie'])
         ->assertCreated()
         ->assertJsonPath('data.name', 'Autonomie');

    $this->assertDatabaseHas('competences', ['name' => 'Autonomie']);
});

it('la création échoue sans nom', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/competences', [])
         ->assertUnprocessable()
         ->assertJsonValidationErrors(['name']);
});

it('la création échoue avec un nom dupliqué', function () {
    $user = userWithRole('User');
    Competence::factory()->create(['name' => 'Mémoire']);

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/competences', ['name' => 'Mémoire'])
         ->assertUnprocessable()
         ->assertJsonValidationErrors(['name']);
});

// ── Détail ────────────────────────────────────────────────────────────────────

it('un utilisateur peut voir une compétence', function () {
    $user       = userWithRole('User');
    $competence = Competence::factory()->create();

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/competences/{$competence->idcompetence}")
         ->assertOk()
         ->assertJsonPath('data.idcompetence', $competence->idcompetence);
});

// ── Modification ─────────────────────────────────────────────────────────────

it('un utilisateur peut modifier une compétence', function () {
    $user       = userWithRole('User');
    $competence = Competence::factory()->create(['name' => 'Ancienne compétence']);

    $this->actingAs($user, 'sanctum')
         ->putJson("/api/competences/{$competence->idcompetence}", ['name' => 'Nouvelle compétence'])
         ->assertOk()
         ->assertJsonPath('data.name', 'Nouvelle compétence');

    $this->assertDatabaseHas('competences', [
        'idcompetence' => $competence->idcompetence,
        'name'         => 'Nouvelle compétence',
    ]);
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer une compétence', function () {
    $user       = userWithRole('User');
    $competence = Competence::factory()->create();

    $this->actingAs($user, 'sanctum')
         ->deleteJson("/api/competences/{$competence->idcompetence}")
         ->assertOk();

    $this->assertDatabaseMissing('competences', ['idcompetence' => $competence->idcompetence]);
});
