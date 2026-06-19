<?php

use App\Models\CartItem;
use App\Models\Pack;

// ── Accès sans auth ───────────────────────────────────────────────────────────

it('retourne 401 sans token sur le panier', function () {
    $this->getJson('/api/cart')->assertUnauthorized();
});

// ── Ajout ─────────────────────────────────────────────────────────────────────

it('un utilisateur peut ajouter un pack au panier', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/cart/add', ['idpack' => $pack->idpack, 'quantity' => 1])
        ->assertOk()
        ->assertJsonPath('message', 'Ajouté au panier');

    $this->assertDatabaseHas('cart_items', [
        'iduser' => $user->iduser,
        'idpack' => $pack->idpack,
    ]);
});

it('ajouter le même pack incrémente la quantité', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/cart/add', ['idpack' => $pack->idpack, 'quantity' => 1]);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/cart/add', ['idpack' => $pack->idpack, 'quantity' => 2]);

    $item = CartItem::where('iduser', $user->iduser)->where('idpack', $pack->idpack)->first();
    expect($item->quantity)->toBe(3);
});

it('l\'ajout échoue si ni activité ni pack n\'est fourni', function () {
    $user = userWithRole('User');

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/cart/add', [])
        ->assertStatus(422);
});

// ── Lecture ───────────────────────────────────────────────────────────────────

it('un utilisateur ne voit que son propre panier', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $pack = Pack::factory()->create();

    CartItem::create(['iduser' => $userA->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);
    CartItem::create(['iduser' => $userB->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);

    $response = $this->actingAs($userA, 'sanctum')
        ->getJson('/api/cart')
        ->assertOk();

    expect($response->json('data'))->toHaveCount(1);
});

// ── Mise à jour ───────────────────────────────────────────────────────────────

it('un utilisateur peut mettre à jour la quantité d\'un article de son panier', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();
    $item = CartItem::create(['iduser' => $user->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);

    $this->actingAs($user, 'sanctum')
        ->patchJson("/api/cart/{$item->id}", ['quantity' => 5])
        ->assertOk();

    expect($item->fresh()->quantity)->toBe(5);
});

it('un utilisateur ne peut pas modifier le panier d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $pack = Pack::factory()->create();
    $item = CartItem::create(['iduser' => $userA->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);

    $this->actingAs($userB, 'sanctum')
        ->patchJson("/api/cart/{$item->id}", ['quantity' => 99])
        ->assertForbidden();
});

// ── Suppression d'un article ──────────────────────────────────────────────────

it('un utilisateur peut supprimer un article de son panier', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();
    $item = CartItem::create(['iduser' => $user->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/cart/{$item->id}")
        ->assertOk();

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

it('un utilisateur ne peut pas supprimer l\'article du panier d\'un autre', function () {
    $userA = userWithRole('User');
    $userB = userWithRole('User');
    $pack = Pack::factory()->create();
    $item = CartItem::create(['iduser' => $userA->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);

    $this->actingAs($userB, 'sanctum')
        ->deleteJson("/api/cart/{$item->id}")
        ->assertForbidden();
});

// ── Vider le panier ───────────────────────────────────────────────────────────

it('un utilisateur peut vider son panier', function () {
    $user = userWithRole('User');
    $pack = Pack::factory()->create();

    CartItem::create(['iduser' => $user->iduser, 'idpack' => $pack->idpack, 'quantity' => 1]);
    CartItem::create(['iduser' => $user->iduser, 'idpack' => $pack->idpack, 'quantity' => 2]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson('/api/cart')
        ->assertOk();

    expect(CartItem::where('iduser', $user->iduser)->count())->toBe(0);
});
