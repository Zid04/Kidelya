<?php

use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Models\Pack;
use App\Models\PackUser;
use App\Models\Role;
use App\Models\User;

// Génère un Stripe-Signature valide pour un payload et un secret donnés.
function signStripePayload(string $payload, string $secret): string
{
    $timestamp = time();
    $sig = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);
    return "t={$timestamp},v1={$sig}";
}

// Envoie un événement webhook signé vers /api/stripe/webhook.
function callStripeWebhook($test, array $event): \Illuminate\Testing\TestResponse
{
    $payload = json_encode($event);
    $header  = signStripePayload($payload, 'test_webhook_secret');

    return $test->call(
        'POST',
        '/api/stripe/webhook',
        [],
        [],
        [],
        [
            'CONTENT_TYPE'          => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => $header,
        ],
        $payload
    );
}

beforeEach(function () {
    config(['services.stripe.webhook_secret' => 'test_webhook_secret']);
});

it('retourne 400 pour une signature Stripe invalide', function () {
    $this->withHeaders(['Stripe-Signature' => 't=1,v1=fausse_signature'])
         ->call('POST', '/api/stripe/webhook', [], [], [], ['CONTENT_TYPE' => 'application/json'], '{}')
         ->assertStatus(400);
});

it('enregistre un achat d\'activité individuelle via webhook', function () {
    $role     = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $role->idrole]);
    $activity = Activity::factory()->create();

    $event = [
        'id'   => 'evt_test_activity',
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id'       => 'cs_test_1',
            'object'   => 'checkout.session',
            'metadata' => [
                'user_id'     => (string) $user->iduser,
                'type'        => 'activity_purchase',
                'activity_id' => (string) $activity->idactivities,
            ],
        ]],
    ];

    callStripeWebhook($this, $event)->assertOk();

    $this->assertDatabaseHas('activity_purchases', [
        'user_id'     => $user->iduser,
        'activity_id' => $activity->idactivities,
    ]);
});

it('ne crée pas de doublon si le même webhook est reçu deux fois', function () {
    $role     = Role::create(['type' => 'User']);
    $user     = User::factory()->create(['idrole' => $role->idrole]);
    $activity = Activity::factory()->create();

    $event = [
        'id'   => 'evt_test_dup',
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id'       => 'cs_test_2',
            'object'   => 'checkout.session',
            'metadata' => [
                'user_id'     => (string) $user->iduser,
                'type'        => 'activity_purchase',
                'activity_id' => (string) $activity->idactivities,
            ],
        ]],
    ];

    callStripeWebhook($this, $event);
    callStripeWebhook($this, $event);

    expect(
        ActivityPurchase::where('user_id', $user->iduser)
            ->where('activity_id', $activity->idactivities)
            ->count()
    )->toBe(1);
});

it('active un abonnement pack via webhook checkout', function () {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create(['idrole' => $role->idrole]);
    $pack = Pack::factory()->create(['duration' => 30]);

    $event = [
        'id'   => 'evt_test_pack',
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id'       => 'cs_test_3',
            'object'   => 'checkout.session',
            'metadata' => [
                'user_id' => (string) $user->iduser,
                'pack_id' => (string) $pack->idpack,
            ],
        ]],
    ];

    callStripeWebhook($this, $event)->assertOk();

    $this->assertDatabaseHas('packs_user', [
        'iduser' => $user->iduser,
        'idpack' => $pack->idpack,
        'status' => 'active',
    ]);
});

it('renvoie 200 pour un type d\'événement Stripe non géré', function () {
    $event = [
        'id'   => 'evt_test_unknown',
        'type' => 'customer.created',
        'data' => ['object' => []],
    ];

    callStripeWebhook($this, $event)->assertOk();
});

it('active un abonnement utilisateur via webhook checkout', function () {
    $role = Role::create(['type' => 'User']);
    $user = User::factory()->create(['idrole' => $role->idrole]);
    $plan = \App\Models\SubscriptionPlan::create([
        'name'           => 'Monthly',
        'price'          => 9.99,
        'interval'       => 'month',
        'interval_count' => 1,
        'has_all_packs'  => true,
        'has_planning'   => true,
        'is_active'      => true,
    ]);

    $event = [
        'id'   => 'evt_test_sub',
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id'       => 'cs_test_sub',
            'object'   => 'checkout.session',
            'metadata' => [
                'user_id' => (string) $user->iduser,
                'type'    => 'subscription',
                'plan_id' => (string) $plan->idplan,
            ],
        ]],
    ];

    callStripeWebhook($this, $event)->assertOk();

    $this->assertDatabaseHas('user_subscriptions', [
        'iduser'  => $user->iduser,
        'idplan'  => $plan->idplan,
        'status'  => 'active',
    ]);
});

it('checkout sans user_id dans les metadata ne plante pas', function () {
    $event = [
        'id'   => 'evt_test_no_user',
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id'       => 'cs_test_no_user',
            'object'   => 'checkout.session',
            'metadata' => [],
        ]],
    ];

    callStripeWebhook($this, $event)->assertOk();
});
