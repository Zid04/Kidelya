<?php

use App\Models\Pack;
use App\Models\SubscriptionPlan;

// ── Packs publics ─────────────────────────────────────────────────────────────

it('GET /public/packs est accessible sans authentification', function () {
    $this->getJson('/api/public/packs')->assertOk();
});

it('GET /public/packs ne retourne que les packs publiés', function () {
    Pack::factory()->create(['is_published' => true,  'title' => 'Pack visible']);
    Pack::factory()->create(['is_published' => false, 'title' => 'Pack caché']);

    $response = $this->getJson('/api/public/packs')->assertOk();

    $titles = collect($response->json('data'))->pluck('title')->all();
    expect($titles)->toContain('Pack visible')
                   ->not->toContain('Pack caché');
});

it('GET /public/packs retourne une structure paginée avec meta', function () {
    $this->getJson('/api/public/packs')
         ->assertOk()
         ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'total']]);
});

it('GET /public/packs/{id} retourne un pack publié', function () {
    $pack = Pack::factory()->create(['is_published' => true]);

    $this->getJson("/api/public/packs/{$pack->idpack}")
         ->assertOk()
         ->assertJsonPath('data.idpack', $pack->idpack);
});

it('GET /public/packs/{id} retourne 404 pour un pack non publié', function () {
    $pack = Pack::factory()->create(['is_published' => false]);

    $this->getJson("/api/public/packs/{$pack->idpack}")->assertNotFound();
});

it('GET /public/packs filtre par recherche textuelle', function () {
    Pack::factory()->create(['is_published' => true, 'title' => 'Peinture et couleurs']);
    Pack::factory()->create(['is_published' => true, 'title' => 'Jardinage créatif']);

    $response = $this->getJson('/api/public/packs?search=Peinture')->assertOk();

    $titles = collect($response->json('data'))->pluck('title')->all();
    expect($titles)->toContain('Peinture et couleurs')
                   ->not->toContain('Jardinage créatif');
});

// ── Plans d'abonnement ────────────────────────────────────────────────────────

it('GET /subscriptions/plans est accessible sans authentification', function () {
    $this->getJson('/api/subscriptions/plans')->assertOk();
});

it('GET /subscriptions/plans ne retourne que les plans actifs', function () {
    SubscriptionPlan::create([
        'name' => 'Monthly', 'price' => 9.99, 'interval' => 'month',
        'interval_count' => 1, 'has_all_packs' => true, 'has_planning' => true,
        'is_active' => true,
    ]);
    SubscriptionPlan::create([
        'name' => 'Free', 'price' => 0, 'interval' => 'none',
        'interval_count' => 0, 'has_all_packs' => false, 'has_planning' => false,
        'is_active' => false, // inactif
    ]);

    $response = $this->getJson('/api/subscriptions/plans')->assertOk();

    $names = collect($response->json())->pluck('name')->all();
    expect($names)->toContain('Monthly')
                  ->not->toContain('Free');
});
