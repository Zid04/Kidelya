<?php

use App\Models\Planning;
use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;

$planningPayload = [
    'title' => 'Activité peinture',
    'date'  => '2026-08-01',
];

it('un utilisateur gratuit peut créer son premier planning', function () use ($planningPayload) {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create(['idrole' => $role->idrole]);

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/plannings', $planningPayload)
         ->assertCreated();
});

it('un utilisateur gratuit ne peut pas créer un deuxième planning', function () use ($planningPayload) {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create(['idrole' => $role->idrole]);

    // Premier planning déjà existant
    Planning::factory()->create(['iduser' => $user->iduser, 'idreport' => null]);

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/plannings', $planningPayload)
         ->assertForbidden();
});

it('un utilisateur avec abonnement payant peut créer plusieurs plannings', function () use ($planningPayload) {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create(['idrole' => $role->idrole]);
    $plan = SubscriptionPlan::create([
        'name'           => 'Monthly',
        'price'          => 9.99,
        'interval'       => 'month',
        'interval_count' => 1,
        'has_all_packs'  => true,
        'has_planning'   => true,
        'is_active'      => true,
    ]);
    UserSubscription::create([
        'iduser'    => $user->iduser,
        'idplan'    => $plan->idplan,
        'starts_at' => now(),
        'ends_at'   => now()->addMonth(),
        'status'    => 'active',
    ]);

    // Premier planning déjà existant — ne doit pas bloquer
    Planning::factory()->create(['iduser' => $user->iduser, 'idreport' => null]);

    $this->actingAs($user, 'sanctum')
         ->postJson('/api/plannings', $planningPayload)
         ->assertCreated();
});

it('un utilisateur ne peut pas accéder au planning d\'un autre', function () {
    $role    = Role::create(['type' => 'User']);
    $owner   = User::factory()->create(['idrole' => $role->idrole]);
    $intruder = User::factory()->create(['idrole' => $role->idrole]);

    $planning = Planning::factory()->create(['iduser' => $owner->iduser, 'idreport' => null]);

    $this->actingAs($intruder, 'sanctum')
         ->getJson("/api/plannings/{$planning->idplanning}")
         ->assertForbidden();
});

it('un utilisateur ne peut pas modifier le planning d\'un autre', function () use ($planningPayload) {
    $role     = Role::create(['type' => 'User']);
    $owner    = User::factory()->create(['idrole' => $role->idrole]);
    $intruder = User::factory()->create(['idrole' => $role->idrole]);
    $planning = Planning::factory()->create(['iduser' => $owner->iduser, 'idreport' => null]);

    $this->actingAs($intruder, 'sanctum')
         ->putJson("/api/plannings/{$planning->idplanning}", $planningPayload)
         ->assertForbidden();
});

it('un utilisateur ne peut pas supprimer le planning d\'un autre', function () {
    $role     = Role::create(['type' => 'User']);
    $owner    = User::factory()->create(['idrole' => $role->idrole]);
    $intruder = User::factory()->create(['idrole' => $role->idrole]);
    $planning = Planning::factory()->create(['iduser' => $owner->iduser, 'idreport' => null]);

    $this->actingAs($intruder, 'sanctum')
         ->deleteJson("/api/plannings/{$planning->idplanning}")
         ->assertForbidden();
});

it('un utilisateur peut ajouter une activité à son planning', function () {
    $role     = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $role->idrole]);
    $planning = Planning::factory()->create(['iduser' => $user->iduser, 'idreport' => null]);
    $activity = \App\Models\Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->postJson("/api/plannings/{$planning->idplanning}/activities", [
             'activity_id' => $activity->idactivities,
             'datestart'   => '2026-08-01',
             'dateend'     => '2026-08-01',
         ])
         ->assertOk();
});

it('un utilisateur peut ajouter un enfant à son planning', function () {
    $role     = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $role->idrole]);
    $planning = Planning::factory()->create(['iduser' => $user->iduser, 'idreport' => null]);
    $child    = \App\Models\Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->postJson("/api/plannings/{$planning->idplanning}/children", [
             'child_id' => $child->idchildren,
         ])
         ->assertOk();
});

it('un utilisateur peut supprimer son planning', function () {
    $role     = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $role->idrole]);
    $planning = Planning::factory()->create(['iduser' => $user->iduser, 'idreport' => null]);

    $this->actingAs($user, 'sanctum')
         ->deleteJson("/api/plannings/{$planning->idplanning}")
         ->assertOk();

    $this->assertDatabaseMissing('plannings', ['idplanning' => $planning->idplanning]);
});
