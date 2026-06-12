<?php

use App\Models\Activity;
use App\Models\Idea;
use App\Services\IdeaService;

// ── Création ──────────────────────────────────────────────────────────────────

it('crée une idée associée à l\'utilisateur', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();

    $idea = $service->create(['title' => 'Mon idée', 'notes' => 'Quelques notes'], $user);

    expect($idea)->toBeInstanceOf(Idea::class)
        ->and($idea->title)->toBe('Mon idée')
        ->and($idea->iduser)->toBe($user->iduser);
});

it('crée une idée sans notes', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();

    $idea = $service->create(['title' => 'Sans notes'], $user);

    expect($idea->notes)->toBeNull();
});

// ── Liste ────────────────────────────────────────────────────────────────────

it('retourne uniquement les idées de l\'utilisateur', function () {
    $userA   = userWithRole('User');
    $userB   = userWithRole('User');
    $service = new IdeaService();

    Idea::factory()->create(['iduser' => $userA->iduser]);
    Idea::factory()->create(['iduser' => $userA->iduser]);
    Idea::factory()->create(['iduser' => $userB->iduser]);

    $results = $service->getAllForUser($userA);

    expect($results)->toHaveCount(2);
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('met à jour le titre d\'une idée', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();
    $idea    = Idea::factory()->create(['iduser' => $user->iduser, 'title' => 'Ancien']);

    $updated = $service->update($idea, ['title' => 'Nouveau']);

    expect($updated->title)->toBe('Nouveau');
});

// ── Suppression ───────────────────────────────────────────────────────────────

it('supprime une idée', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();
    $idea    = Idea::factory()->create(['iduser' => $user->iduser]);

    $service->delete($idea);

    expect(Idea::find($idea->ididea))->toBeNull();
});

// ── Conversion ────────────────────────────────────────────────────────────────

it('convertit une idée en activité brouillon', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();
    $idea    = Idea::factory()->create([
        'title'  => 'Idée à convertir',
        'notes'  => 'Notes de l\'idée',
        'iduser' => $user->iduser,
    ]);

    $activity = $service->convertToActivity($idea, $user);

    expect($activity)->toBeInstanceOf(Activity::class)
        ->and($activity->title)->toBe('Idée à convertir')
        ->and($activity->description)->toBe('Notes de l\'idée')
        ->and($activity->iduser)->toBe($user->iduser)
        ->and((bool) $activity->is_published)->toBeFalse()
        ->and((bool) $activity->is_purchasable)->toBeFalse();
});

it('supprime l\'idée après conversion', function () {
    $user    = userWithRole('User');
    $service = new IdeaService();
    $idea    = Idea::factory()->create(['iduser' => $user->iduser]);

    $service->convertToActivity($idea, $user);

    expect(Idea::find($idea->ididea))->toBeNull();
});
