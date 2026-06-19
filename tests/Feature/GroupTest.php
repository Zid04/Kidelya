<?php

use App\Models\Child;
use App\Models\Group;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur les groupes', function () {
    $this->getJson('/api/groups')->assertUnauthorized();
});

// ── Création ─────────────────────────────────────────────────────────────────

it('un utilisateur peut créer un groupe', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/groups', ['name' => 'Groupe Maternelle'])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Groupe Maternelle');

    $this->assertDatabaseHas('groups', ['name' => 'Groupe Maternelle', 'iduser' => $user->iduser]);
});

// ── Lecture ───────────────────────────────────────────────────────────────────

it('un utilisateur ne voit que ses propres groupes', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');

    Group::factory()->count(2)->create(['iduser' => $userA->iduser]);
    Group::factory()->count(3)->create(['iduser' => $userB->iduser]);

    $response = $this->actingAs($userA, 'sanctum')
        ->getJson('/api/groups')
        ->assertOk();

    // La réponse contient uniquement les groupes de userA
    $ids = collect($response->json('data'))->pluck('idgroup')->all();
    foreach ($ids as $id) {
        expect(Group::find($id)->iduser)->toBe($userA->iduser);
    }
});

it('un utilisateur peut voir le détail d\'un de ses groupes', function () {
    $user = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/groups/{$group->idgroup}")
        ->assertOk()
        ->assertJsonPath('data.idgroup', $group->idgroup);
});

it('un utilisateur ne peut pas voir le groupe d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $userA->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->getJson("/api/groups/{$group->idgroup}")
        ->assertForbidden();
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un utilisateur peut modifier son groupe', function () {
    $user = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/groups/{$group->idgroup}", ['name' => 'Nouveau nom'])
        ->assertOk()
        ->assertJsonPath('data.name', 'Nouveau nom');
});

it('un utilisateur ne peut pas modifier le groupe d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $userA->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->putJson("/api/groups/{$group->idgroup}", ['name' => 'Tentative'])
        ->assertForbidden();
});

// ── Suppression ──────────────────────────────────────────────────────────────

it('un utilisateur peut supprimer son groupe', function () {
    $user = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/groups/{$group->idgroup}")
        ->assertOk();

    $this->assertDatabaseMissing('groups', ['idgroup' => $group->idgroup]);
});

// ── Gestion des enfants dans un groupe ───────────────────────────────────────

it('un utilisateur peut ajouter un enfant à son groupe', function () {
    $user = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $user->iduser]);
    $child = Child::factory()->create(['iduser' => $user->iduser]);

    $this->actingAs($user, 'sanctum')
        ->postJson("/api/groups/{$group->idgroup}/children", ['child_id' => $child->idchildren])
        ->assertOk();

    $this->assertDatabaseHas('groups_children', [
        'idgroup' => $group->idgroup,
        'idchildren' => $child->idchildren,
    ]);
});

it('un utilisateur peut retirer un enfant de son groupe', function () {
    $user = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $user->iduser]);
    $child = Child::factory()->create(['iduser' => $user->iduser]);
    $group->children()->attach($child->idchildren);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/groups/{$group->idgroup}/children", ['child_id' => $child->idchildren])
        ->assertOk();

    $this->assertDatabaseMissing('groups_children', [
        'idgroup' => $group->idgroup,
        'idchildren' => $child->idchildren,
    ]);
});

it('un utilisateur ne peut pas modifier le groupe d\'un autre pour y ajouter un enfant', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $group = Group::factory()->create(['iduser' => $userA->iduser]);
    $child = Child::factory()->create(['iduser' => $userB->iduser]);

    $this->actingAs($userB, 'sanctum')
        ->postJson("/api/groups/{$group->idgroup}/children", ['child_id' => $child->idchildren])
        ->assertForbidden();
});
