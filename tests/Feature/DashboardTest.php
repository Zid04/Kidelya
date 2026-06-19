<?php

use App\Models\Activity;

it('retourne 401 sans token sur le dashboard', function () {
    $this->getJson('/api/dashboard')->assertUnauthorized();
});

it('le dashboard retourne les statistiques de l\'utilisateur connecté', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/dashboard')
        ->assertOk()
        ->assertJsonStructure([
            'user',
            'stats' => [
                'activities_created',
                'activities_favorites',
                'activities_planned',
                'packs_purchased',
            ],
            'activities',
            'recommended_packs',
        ]);
});

it('le compteur d\'activités créées reflète uniquement les activités du user', function () {
    $user = userWithRole('User');
    Activity::factory()->count(3)->create(['iduser' => $user->iduser]);
    Activity::factory()->count(2)->create();

    $response = $this->actingAs($user, 'sanctum')
        ->getJson('/api/dashboard')
        ->assertOk();

    expect($response->json('stats.activities_created'))->toBe(3);
});

it('le dashboard d\'un user sans données retourne des compteurs à zéro', function () {
    $user = userWithRole('User');

    $response = $this->actingAs($user, 'sanctum')
        ->getJson('/api/dashboard')
        ->assertOk();

    expect($response->json('stats.activities_created'))->toBe(0);
    expect($response->json('stats.packs_purchased'))->toBe(0);
});
