<?php

use App\Models\Activity;
use App\Models\Favorite;
use App\Models\Pack;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les favoris', function () {
    $this->getJson('/api/favorites')->assertUnauthorized();
});

// ── Liste ────────────────────────────────────────────────────────────────────

it('un utilisateur peut lister ses favoris', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/favorites')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

it('un utilisateur ne voit que ses propres favoris', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');

    $activity = Activity::factory()->create(['is_published' => true, 'iduser' => $userA->iduser]);

    Favorite::create(['iduser' => $userA->iduser, 'idactivity' => $activity->idactivities]);
    Favorite::create(['iduser' => $userB->iduser, 'idactivity' => $activity->idactivities]);

    $response = $this->actingAs($userA, 'sanctum')
        ->getJson('/api/favorites')
        ->assertOk();

    expect(count($response->json('data')))->toBe(1);
});

// ── Ajout ────────────────────────────────────────────────────────────────────

it('un utilisateur peut ajouter une activité aux favoris', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/favorites/add', ['idactivity' => $activity->idactivities])
        ->assertOk()
        ->assertJsonFragment(['message' => 'Ajouté aux favoris']);

    $this->assertDatabaseHas('favorites', [
        'iduser' => $user->iduser,
        'idactivity' => $activity->idactivities,
    ]);
});

it('un utilisateur peut ajouter un pack aux favoris', function () {
    $admin = userWithRole('Admin');
    $pack = Pack::factory()->create();

    $this->actingAs($admin, 'sanctum')
        ->postJson('/api/favorites/add', ['idpack' => $pack->idpack])
        ->assertOk()
        ->assertJsonFragment(['message' => 'Ajouté aux favoris']);

    $this->assertDatabaseHas('favorites', [
        'iduser' => $admin->iduser,
        'idpack' => $pack->idpack,
    ]);
});

it('ajouter le même favori ne crée pas de doublon', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/favorites/add', ['idactivity' => $activity->idactivities]);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/favorites/add', ['idactivity' => $activity->idactivities]);

    expect(
        Favorite::where('iduser', $user->iduser)
            ->where('idactivity', $activity->idactivities)
            ->count()
    )->toBe(1);
});

it('l\'ajout échoue si ni activité ni pack n\'est fourni', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/favorites/add', [])
        ->assertStatus(422);
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('un utilisateur peut retirer une activité de ses favoris', function () {
    $user = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    Favorite::create(['iduser' => $user->iduser, 'idactivity' => $activity->idactivities]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson('/api/favorites/remove', ['idactivity' => $activity->idactivities])
        ->assertOk();

    $this->assertDatabaseMissing('favorites', [
        'iduser' => $user->iduser,
        'idactivity' => $activity->idactivities,
    ]);
});

it('un utilisateur peut retirer un pack de ses favoris', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();

    Favorite::create(['iduser' => $user->iduser, 'idpack' => $pack->idpack]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson('/api/favorites/remove', ['idpack' => $pack->idpack])
        ->assertOk();

    $this->assertDatabaseMissing('favorites', [
        'iduser' => $user->iduser,
        'idpack' => $pack->idpack,
    ]);
});
