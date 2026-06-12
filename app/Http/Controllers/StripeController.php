<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Models\Pack;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\PackUser;
use App\Services\StripeService;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use App\Notifications\SubscriptionConfirmedNotification;
use App\Notifications\PaymentFailedNotification;

class StripeController extends Controller
{
    public function __construct(
        private readonly StripeService $stripeService
    ) {}

    /**
     * Webhook Stripe
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Les types d'événements inconnus sont enregistrés mais pas rejetés — renvoyer un 200 empêche Stripe
        // de relancer la requête et d'inonder les logs avec des événements qu'on ignore intentionnellement.
        match ($event->type) {
            'checkout.session.completed'    => $this->handleCheckoutCompleted($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionCancelled($event->data->object),
            'invoice.payment_failed'        => $this->handlePaymentFailed($event->data->object),
            default                         => Log::info("Unhandled Stripe event: " . $event->type),
        };

        return response()->json(['status' => 'ok']);
    }

    /**
     * Checkout complété — activer l'abonnement ou enregistrer un achat individuel
     */
    private function handleCheckoutCompleted(object $session): void
    {
        $userId     = $session->metadata->user_id ?? null;
        $type       = $session->metadata->type ?? null;
        $activityId = $session->metadata->activity_id ?? null;
        $packId     = $session->metadata->pack_id ?? null;

        if (!$userId) {
            Log::warning('Checkout session missing user_id', ['session' => $session->id]);
            return;
        }

        // ── Abonnement ────────────────────────────────────────────
        if ($type === 'subscription' && isset($session->metadata->plan_id)) {
            $plan = SubscriptionPlan::find($session->metadata->plan_id);
            $user = User::find($userId);

            if (!$user || !$plan) {
                Log::warning('User or Plan not found for subscription', ['user_id' => $userId, 'plan_id' => $session->metadata->plan_id]);
                return;
            }

            app(SubscriptionService::class)->subscribe($user, $plan);
            Log::info('Abonnement activé via webhook', ['user_id' => $userId, 'plan_id' => $plan->idplan]);
            return;
        }

        // ── Achat d'activité individuelle ou multiple ─────────────
        if ($type === 'activity_purchase') {
            $user = User::find($userId);
            if (!$user) {
                Log::warning('User not found for activity purchase', compact('userId'));
                return;
            }

            $activityIds = isset($session->metadata->activity_ids)
                ? array_filter(array_map('intval', explode(',', $session->metadata->activity_ids)))
                : ($activityId ? [(int) $activityId] : []);

            foreach ($activityIds as $id) {
                $activity = Activity::find($id);
                if (!$activity) {
                    Log::warning('Activity not found', ['activity_id' => $id]);
                    continue;
                }
                ActivityPurchase::firstOrCreate(
                    ['user_id' => $userId, 'activity_id' => $id],
                    ['credits_spent' => 0, 'purchased_at' => now()]
                );
                Log::info('Achat activité enregistré', ['user_id' => $userId, 'activity_id' => $id]);
            }
            return;
        }

        $user = User::find($userId);
        if (!$user) {
            Log::warning('User not found for pack checkout', ['user_id' => $userId]);
            return;
        }

        // Support pour multi-packs (pack_ids = "1,2,3") et single pack (pack_id)
        $packIds = isset($session->metadata->pack_ids)
            ? array_filter(array_map('intval', explode(',', $session->metadata->pack_ids)))
            : ($packId ? [$packId] : []);

        if (empty($packIds)) {
            Log::warning('Checkout session missing pack metadata', ['session' => $session->id]);
            return;
        }

        foreach ($packIds as $id) {
            $pack = Pack::find($id);
            if (!$pack) {
                Log::warning('Pack not found', ['pack_id' => $id]);
                continue;
            }

            PackUser::updateOrCreate(
                ['iduser' => $userId, 'idpack' => $id],
                [
                    'status'           => 'active',
                    'subscriptiondate' => now(),
                    'expirationdate'   => now()->addDays($pack->duration ?? 30),
                ]
            );

            $user->notify(new SubscriptionConfirmedNotification($pack));
            Log::info('Abonnement pack activé', ['user_id' => $userId, 'pack_id' => $id]);
        }
    }

    /**
     * Abonnement annulé
     */
    private function handleSubscriptionCancelled(object $subscription): void
    {
        PackUser::where('stripe_subscription_id', $subscription->id)
            ->update(['status' => 'canceled']);

        Log::info('Abonnement annulé', ['stripe_id' => $subscription->id]);
    }

    /**
     * Paiement échoué
     */
    private function handlePaymentFailed(object $invoice): void
    {
        $user = User::where('email', $invoice->customer_email ?? '')->first();
        if ($user) {
            $user->notify(new PaymentFailedNotification());
        }

        Log::warning('Paiement échoué', ['invoice' => $invoice->id]);
    }

    /**
     * Créer une session Checkout (un pack ou plusieurs via pack_ids)
     */
    public function createCheckout(Request $request): JsonResponse
    {
        $request->validate([
            'pack_id'      => 'nullable|exists:packs,idpack',
            'pack_ids'     => 'nullable|array|min:1',
            'pack_ids.*'   => 'integer|exists:packs,idpack',
            'quantity'     => 'nullable|integer|min:1',
            'quantities'   => 'nullable|array',
            'quantities.*' => 'integer|min:1',
        ]);

        $user = $request->user();

        if ($request->filled('pack_ids') && count($request->pack_ids) > 1) {
            $packs      = Pack::findMany($request->pack_ids)->all();
            $quantities = $request->quantities ?? [];
            $session    = $this->stripeService->createMultiPackCheckoutSession($user, $packs, $quantities);
        } else {
            $packId   = $request->pack_id ?? $request->pack_ids[0];
            $pack     = Pack::findOrFail($packId);
            $quantity = max(1, (int) ($request->quantity ?? 1));
            $session  = $this->stripeService->createCheckoutSession($user, $pack, $quantity);
        }

        return response()->json(['url' => $session->url]);
    }

    /**
     * Créer une session Checkout pour l'achat d'une ou plusieurs activités
     */
    public function createActivityCheckout(Request $request): JsonResponse
    {
        $request->validate([
            'activity_id'    => 'nullable|exists:activities,idactivities',
            'activity_ids'   => 'nullable|array|min:1',
            'activity_ids.*' => 'integer|exists:activities,idactivities',
        ]);

        $user = $request->user();

        if ($request->filled('activity_ids') && count($request->activity_ids) > 1) {
            $activities = Activity::findMany($request->activity_ids)->all();
            $session    = $this->stripeService->createMultiActivityCheckoutSession($user, $activities);
        } else {
            $activityId = $request->activity_id ?? $request->activity_ids[0];
            $activity   = Activity::findOrFail($activityId);
            $session    = $this->stripeService->createActivityCheckoutSession($user, $activity);
        }

        return response()->json(['url' => $session->url]);
    }

    /**
     * Liste des paiements Stripe
     */
    public function payments(): JsonResponse
    {
        $payments = $this->stripeService->getPayments();

        return response()->json([
            'data' => collect($payments)->map(fn($charge) => [
                'id'         => $charge->id,
                'amount'     => $charge->amount / 100,
                'currency'   => strtoupper($charge->currency),
                'status'     => $charge->status,
                'email'      => $charge->billing_details->email ?? null,
                'created_at' => date('Y-m-d H:i', $charge->created),
                'refunded'   => $charge->refunded,
            ])
        ]);
    }

    /**
     * Rembourser un paiement
     */
    public function refund(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent' => 'required|string',
        ]);

        $this->stripeService->refund($request->payment_intent);

        return response()->json(['message' => 'Remboursement effectué avec succès']);
    }

    /**
     * Liste des coupons
     */
    public function coupons(): JsonResponse
    {
        return response()->json([
            'data' => $this->stripeService->getCoupons()
        ]);
    }

    /**
     * Créer un coupon
     */
    public function createCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'name'           => 'required|string',
            'discount_type'  => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:1',
            'max_uses'       => 'nullable|integer|min:1',
            'expires_at'     => 'nullable|date',
        ]);

        $coupon = $this->stripeService->createCoupon($request->validated());

        return response()->json([
            'message' => 'Coupon créé avec succès',
            'data'    => $coupon
        ], 201);
    }

    /**
     * Supprimer un coupon
     */
    public function deleteCoupon(string $couponId): JsonResponse
    {
        $this->stripeService->deleteCoupon($couponId);

        return response()->json(['message' => 'Coupon supprimé']);
    }
}