<?php

use App\Models\Activity;
use App\Models\Role;
use App\Models\User;

it('retourne 401 sans token d\'authentification', function () {
    $this->getJson('/api/activities/mine')->assertUnauthorized();
});

it('un utilisateur peut voir une activité publiée d\'un autre', function () {
    $roleUser  = Role::create(['type' => 'User']);
    $owner     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $viewer    = User::factory()->create(['idrole' => $roleUser->idrole]);
    $activity  = Activity::factory()->create(['iduser' => $owner->iduser, 'is_published' => true]);

    $this->actingAs($viewer, 'sanctum')
         ->getJson("/api/activities/{$activity->idactivities}")
         ->assertOk();
});

it('un utilisateur ne peut pas voir une activité non publiée d\'un autre', function () {
    $roleUser  = Role::create(['type' => 'User']);
    $owner     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $viewer    = User::factory()->create(['idrole' => $roleUser->idrole]);
    $activity  = Activity::factory()->create(['iduser' => $owner->iduser, 'is_published' => false]);

    $this->actingAs($viewer, 'sanctum')
         ->getJson("/api/activities/{$activity->idactivities}")
         ->assertForbidden();
});

it('un utilisateur peut voir sa propre activité non publiée', function () {
    $roleUser = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $activity = Activity::factory()->create(['iduser' => $user->iduser, 'is_published' => false]);

    $this->actingAs($user, 'sanctum')
         ->getJson("/api/activities/{$activity->idactivities}")
         ->assertOk();
});

it('un utilisateur ne peut pas modifier l\'activité d\'un autre', function () {
    $roleUser  = Role::create(['type' => 'User']);
    $owner     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $intruder  = User::factory()->create(['idrole' => $roleUser->idrole]);
    $activity  = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($intruder, 'sanctum')
         ->putJson("/api/activities/{$activity->idactivities}", ['title' => 'Tentative'])
         ->assertForbidden();
});

it('un utilisateur peut modifier sa propre activité', function () {
    $roleUser = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $activity = Activity::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
         ->putJson("/api/activities/{$activity->idactivities}", [
             'title'    => 'Nouveau titre',
             'agemin'   => 3,
             'agemax'   => 8,
             'duration' => 45,
         ])
         ->assertStatus(200);
});

it('un admin peut modifier l\'activité de n\'importe quel utilisateur', function () {
    $roleUser  = Role::create(['type' => 'User']);
    $roleAdmin = Role::create(['type' => 'Admin']);
    $owner     = User::factory()->create(['idrole' => $roleUser->idrole]);
    $admin     = User::factory()->create(['idrole' => $roleAdmin->idrole]);
    $activity  = Activity::factory()->create(['iduser' => $owner->iduser]);

    $this->actingAs($admin, 'sanctum')
         ->putJson("/api/activities/{$activity->idactivities}", [
             'title'    => 'Modifié par admin',
             'agemin'   => 3,
             'agemax'   => 8,
             'duration' => 45,
         ])
         ->assertStatus(200);
});
