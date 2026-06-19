<?php

use App\Models\Activity;
use App\Services\ActivityService;

// ── Création ──────────────────────────────────────────────────────────────────

it('crée une activité avec les données fournies', function () {
    $user = userWithRole('User');
    $service = new ActivityService;

    $activity = $service->create([
        'title' => 'Activité test',
        'iduser' => $user->iduser,
    ]);

    expect($activity)->toBeInstanceOf(Activity::class)
        ->and($activity->title)->toBe('Activité test')
        ->and($activity->iduser)->toBe($user->iduser);
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('met à jour les champs d\'une activité', function () {
    $user = userWithRole('User');
    $service = new ActivityService;
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'title' => 'Ancien titre']);

    $updated = $service->update($activity, ['title' => 'Nouveau titre']);

    expect($updated->title)->toBe('Nouveau titre');
});

it('retourne une instance fraîche après mise à jour', function () {
    $user = userWithRole('User');
    $service = new ActivityService;
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $result = $service->update($activity, ['title' => 'Titre frais']);

    expect($result)->toBeInstanceOf(Activity::class)
        ->and($result->title)->toBe('Titre frais');
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('supprime (soft delete) une activité', function () {
    $user = userWithRole('User');
    $service = new ActivityService;
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $service->delete($activity);

    expect(Activity::find($activity->idactivities))->toBeNull();
    expect(Activity::withTrashed()->find($activity->idactivities))->not->toBeNull();
});

// ── Publication ───────────────────────────────────────────────────────────────

it('publie une activité', function () {
    $user = userWithRole('User');
    $service = new ActivityService;
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => false]);

    $result = $service->publish($activity);

    expect($result->is_published)->toBeTrue();
});

it('dépublie une activité', function () {
    $user = userWithRole('User');
    $service = new ActivityService;
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => true]);

    $result = $service->unpublish($activity);

    expect($result->is_published)->toBeFalse();
});

// ── Pagination ────────────────────────────────────────────────────────────────

it('retourne une pagination d\'activités', function () {
    $user = userWithRole('User');
    $service = new ActivityService;

    Activity::factory()->count(3)->create(['iduser' => $user->iduser]);

    $result = $service->getPaginated();

    expect($result->count())->toBe(3)
        ->and($result->currentPage())->toBe(1);
});

it('filtre les activités par âge', function () {
    $user = userWithRole('User');
    $service = new ActivityService;

    Activity::factory()->create(['iduser' => $user->iduser, 'agemin' => 3, 'agemax' => 6]);
    Activity::factory()->create(['iduser' => $user->iduser, 'agemin' => 8, 'agemax' => 12]);

    $result = $service->getPaginated(['age' => 5]);

    expect($result->count())->toBe(1);
});
