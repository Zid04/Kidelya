<?php

use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;

// ── Bibliothèque (index) ──────────────────────────────────────────────────────

it('GET /activities/library liste uniquement les activités publiées de l\'admin', function () {
    $admin = userWithRole('Admin');
    $user  = userWithRole('User');

    Activity::factory()->create(['iduser' => $admin->iduser, 'is_published' => true,  'title' => 'Visible Admin']);
    Activity::factory()->create(['iduser' => $admin->iduser, 'is_published' => false, 'title' => 'Cachée Admin']);
    Activity::factory()->create(['iduser' => $user->iduser,  'is_published' => true,  'title' => 'Publiée User']);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson('/api/activities/library')
                     ->assertOk();

    $titles = collect($response->json())->pluck('title')->all();
    expect($titles)->toContain('Visible Admin')
                   ->not->toContain('Cachée Admin')
                   ->not->toContain('Publiée User');
});

it('GET /activities/library retourne 401 sans token', function () {
    $this->getJson('/api/activities/library')->assertUnauthorized();
});

// ── Détail d'une activité en bibliothèque ─────────────────────────────────────

it('GET /activities/library/{id} retourne 404 pour une activité non publiée', function () {
    $admin    = userWithRole('Admin');
    $user     = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $admin->iduser, 'is_published' => false]);

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/activities/library/{$activity->idactivities}")
         ->assertNotFound();
});

it('GET /activities/library/{id} retourne 404 pour une activité publiée par un non-admin', function () {
    $user     = userWithRole('User');
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => true]);

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/activities/library/{$activity->idactivities}")
         ->assertNotFound();
});

it('une activité achetée est marquée is_owned dans la bibliothèque', function () {
    $admin    = userWithRole('Admin');
    $user     = userWithRole('User');
    $activity = Activity::factory()->create([
        'iduser'         => $admin->iduser,
        'is_published'   => true,
        'is_purchasable' => true,
    ]);

    ActivityPurchase::create([
        'user_id'       => $user->iduser,
        'activity_id'   => $activity->idactivities,
        'credits_spent' => 0,
        'purchased_at'  => now(),
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.is_owned'))->toBeTrue();
});

it('une activité non achetée est marquée is_owned = false', function () {
    $admin    = userWithRole('Admin');
    $user     = userWithRole('User');
    $activity = Activity::factory()->create([
        'iduser'         => $admin->iduser,
        'is_published'   => true,
        'is_purchasable' => true,
    ]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.is_owned'))->toBeFalse();
});

it('un abonné Monthly a has_subscription = true pour toute activité admin publiée', function () {
    $admin    = userWithRole('Admin');
    $user     = userWithRole('User');
    $plan     = SubscriptionPlan::create([
        'name' => 'Monthly', 'price' => 5.99, 'interval' => 'month',
        'interval_count' => 1, 'has_all_packs' => true, 'has_planning' => true, 'is_active' => true,
    ]);
    UserSubscription::create([
        'iduser'    => $user->iduser,
        'idplan'    => $plan->idplan,
        'starts_at' => now()->subDay(),
        'ends_at'   => now()->addDays(29),
        'status'    => 'active',
    ]);
    $activity = Activity::factory()->create(['iduser' => $admin->iduser, 'is_published' => true]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.has_subscription'))->toBeTrue();
});

it('un abonnement expiré ne donne pas accès', function () {
    $admin    = userWithRole('Admin');
    $user     = userWithRole('User');
    $plan     = SubscriptionPlan::create([
        'name' => 'Monthly', 'price' => 5.99, 'interval' => 'month',
        'interval_count' => 1, 'has_all_packs' => true, 'has_planning' => true, 'is_active' => true,
    ]);
    UserSubscription::create([
        'iduser'    => $user->iduser,
        'idplan'    => $plan->idplan,
        'starts_at' => now()->subDays(60),
        'ends_at'   => now()->subDays(1),
        'status'    => 'active',
    ]);
    $activity = Activity::factory()->create(['iduser' => $admin->iduser, 'is_published' => true]);

    $response = $this->actingAs($user, 'sanctum')
                     ->getJson("/api/activities/library/{$activity->idactivities}")
                     ->assertOk();

    expect($response->json('data.has_subscription'))->toBeFalse();
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
