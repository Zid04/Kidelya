<?php

use App\Models\Activity;
use App\Models\ActivityPurchase;

// ── Bibliothèque (index) ──────────────────────────────────────────────────────

it('GET /activities/library liste uniquement les activités publiées', function () {
    $user = userWithRole('User');

    Activity::factory()->create(['is_published' => true,  'title' => 'Visible']);
    Activity::factory()->create(['is_published' => false, 'title' => 'Cachée']);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson('/api/activities/library')
                     ->assertOk();

    $titles = collect($response->json())->pluck('title')->all();
    expect($titles)->toContain('Visible')
                   ->not->toContain('Cachée');
});

it('GET /activities/library retourne 401 sans token', function () {
    $this->getJson('/api/activities/library')->assertUnauthorized();
});

// ── Détail d'une activité en bibliothèque ─────────────────────────────────────

it('GET /activities/library/{id} retourne 404 pour une activité non publiée', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create(['is_published' => false, 'is_purchasable' => true]);

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/activities/library/{$activity->idactivities}")
         ->assertNotFound();
});

it('une activité achetée est marquée is_owned dans la bibliothèque', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create([
        'is_published'  => true,
        'is_purchasable' => true,
    ]);

    ActivityPurchase::create([
        'user_id'     => $user->iduser,
        'activity_id' => $activity->idactivities,
        'credits_spent' => 0,
        'purchased_at'  => now(),
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.is_owned'))->toBeTrue();
});

it('une activité non achetée est marquée is_owned = false', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create([
        'is_published'   => true,
        'is_purchasable' => true,
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.is_owned'))->toBeFalse();
});

// ── Ma bibliothèque (achats) ──────────────────────────────────────────────────

it('GET /me/purchases retourne 401 sans token', function () {
    $this->getJson('/api/me/purchases')->assertUnauthorized();
});

it('GET /me/purchases retourne les achats de l\'utilisateur', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create(['is_published' => true]);

    ActivityPurchase::create([
        'user_id'       => $user->iduser,
        'activity_id'   => $activity->idactivities,
        'credits_spent' => 0,
        'purchased_at'  => now(),
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson('/api/me/purchases')
                     ->assertOk();

    $response->assertJsonStructure(['data' => ['activities', 'packs']]);
    expect($response->json('data.activities'))->toHaveCount(1);
});

it('GET /me/purchases ne retourne pas les achats d\'un autre utilisateur', function () {
    $userA    = userWithRole('User');
    $userB    = userWithRole('User');
    $activity = Activity::factory()->create(['is_published' => true]);

    ActivityPurchase::create([
        'user_id'       => $userA->iduser,
        'activity_id'   => $activity->idactivities,
        'credits_spent' => 0,
        'purchased_at'  => now(),
    ]);

    $response = $this->actingAs($userB, 'sanctum')
                     ->getJson('/api/me/purchases')
                     ->assertOk();

    expect($response->json('data.activities'))->toHaveCount(0);
});

// ── Historique des transactions ───────────────────────────────────────────────

it('GET /me/transactions retourne 401 sans token', function () {
    $this->getJson('/api/me/transactions')->assertUnauthorized();
});

it('GET /me/transactions liste les achats de l\'utilisateur', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create();

    ActivityPurchase::create([
        'user_id'       => $user->iduser,
        'activity_id'   => $activity->idactivities,
        'credits_spent' => 0,
        'purchased_at'  => now(),
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson('/api/me/transactions')
                     ->assertOk();

    $response->assertJsonStructure(['data' => [['id', 'type', 'title', 'amount', 'status']]]);
});
