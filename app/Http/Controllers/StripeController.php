<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\User;
use App\Models\PackUser;
use App\Services\StripeService;
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

        match ($event->type) {
            'checkout.session.completed'    => $this->handleCheckoutCompleted($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionCancelled($event->data->object),
            'invoice.payment_failed'        => $this->handlePaymentFailed($event->data->object),
            default                         => Log::info("Unhandled Stripe event: " . $event->type),
        };

        return response()->json(['status' => 'ok']);
    }

    /**
     * Checkout complété — activer l'abonnement
     */
    private function handleCheckoutCompleted(object $session): void
    {
        $userId = $session->metadata->user_id ?? null;
        $packId = $session->metadata->pack_id ?? null;

        if (!$userId || !$packId) {
            Log::warning('Checkout session missing metadata', ['session' => $session->id]);
            return;
        }

        $user = User::find($userId);
        $pack = Pack::find($packId);

        if (!$user || !$pack) {
            Log::warning('User or Pack not found', compact('userId', 'packId'));
            return;
        }

        PackUser::updateOrCreate(
            ['iduser' => $userId, 'idpack' => $packId],
            [
                'status'           => 'active',
                'subscriptiondate' => now(),
                'expirationdate'   => now()->addDays($pack->duration),
            ]
        );

        $user->notify(new SubscriptionConfirmedNotification($pack));

        Log::info('Abonnement activé', ['user_id' => $userId, 'pack_id' => $packId]);
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
     * Créer une session Checkout
     */
    public function createCheckout(Request $request): JsonResponse
    {
        $request->validate([
            'pack_id' => 'required|exists:packs,idpack',
        ]);

        $pack    = Pack::findOrFail($request->pack_id);
        $user    = $request->user();
        $session = $this->stripeService->createCheckoutSession($user, $pack);

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