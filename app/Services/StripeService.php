<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Refund;
use Stripe\Coupon;
use Stripe\Invoice;
use App\Models\Activity;
use App\Models\Pack;
use App\Models\User;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Créer une session de paiement Stripe Checkout
     */
    public function createCheckoutSession(User $user, Pack $pack, int $quantity = 1): Session
    {
        return Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'subscription',
            'customer_email'       => $user->email,
            'metadata'             => [
                'user_id' => $user->iduser,
                'pack_id' => $pack->idpack,
            ],
            'line_items' => [[
                'price_data' => [
                    'currency'     => 'eur',
                    'unit_amount'  => (int) round($pack->tarification * 100),
                    'recurring'    => [
                        'interval' => $pack->type === 'yearly' ? 'year' : 'month',
                    ],
                    'product_data' => [
                        'name'        => $pack->title,
                        'description' => $pack->description,
                    ],
                ],
                'quantity' => $quantity,
            ]],
            'success_url' => config('app.frontend_url') . '/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/cancel',
        ]);
    }

    /**
     * Créer une session de paiement Stripe Checkout pour plusieurs packs
     */
    public function createMultiPackCheckoutSession(User $user, array $packs, array $quantities = []): Session
    {
        $packs     = array_values($packs);
        $lineItems = [];
        foreach ($packs as $i => $pack) {
            $lineItems[] = [
                'price_data' => [
                    'currency'     => 'eur',
                    'unit_amount'  => (int) round($pack->tarification * 100),
                    'product_data' => [
                        'name'        => $pack->title,
                        'description' => $pack->description ?? '',
                    ],
                ],
                'quantity' => (int) ($quantities[$i] ?? 1),
            ];
        }

        $packIds = implode(',', array_map(fn(Pack $p) => $p->idpack, $packs));

        return Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'payment',
            'customer_email'       => $user->email,
            'metadata'             => [
                'user_id'  => $user->iduser,
                'pack_ids' => $packIds,
            ],
            'line_items'  => $lineItems,
            'success_url' => config('app.frontend_url') . '/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/cancel',
        ]);
    }

    /**
     * Créer une session de paiement pour plusieurs activités
     */
    public function createMultiActivityCheckoutSession(User $user, array $activities): Session
    {
        $lineItems = [];
        foreach ($activities as $activity) {
            $lineItems[] = [
                'price_data' => [
                    'currency'     => 'eur',
                    'unit_amount'  => (int) round(($activity->credit_price ?? 0) * 100),
                    'product_data' => [
                        'name'        => $activity->title,
                        'description' => $activity->description ?? '',
                    ],
                ],
                'quantity' => 1,
            ];
        }

        $activityIds = implode(',', array_map(fn(Activity $a) => $a->idactivities, $activities));

        return Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'payment',
            'customer_email'       => $user->email,
            'metadata'             => [
                'user_id'      => $user->iduser,
                'activity_ids' => $activityIds,
                'type'         => 'activity_purchase',
            ],
            'line_items'  => $lineItems,
            'success_url' => config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/payment/failed',
        ]);
    }

    /**
     * Créer une session de paiement unique pour une activité individuelle
     */
    public function createActivityCheckoutSession(User $user, Activity $activity): Session
    {
        $priceInCents = ($activity->credit_price ?? 0) * 100;

        return Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'payment',
            'customer_email'       => $user->email,
            'metadata'             => [
                'user_id'     => $user->iduser,
                'activity_id' => $activity->idactivities,
                'type'        => 'activity_purchase',
            ],
            'line_items' => [[
                'price_data' => [
                    'currency'     => 'eur',
                    'unit_amount'  => $priceInCents,
                    'product_data' => [
                        'name'        => $activity->title,
                        'description' => $activity->description ?? '',
                    ],
                ],
                'quantity' => 1,
            ]],
            'success_url' => config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/payment/failed',
        ]);
    }

    /**
     * Récupérer une invoice Stripe (OBLIGATOIRE pour ton webhook)
     */
    public function getInvoice(string $invoiceId): ?\Stripe\Invoice
{
    try {
        return \Stripe\Invoice::retrieve([
            'id' => $invoiceId,
            'expand' => ['customer', 'lines.data.price.product']
        ]);
    } catch (\Exception $e) {
        \Log::error('Stripe getInvoice error: '.$e->getMessage());
        return null;
    }
}


    /**
     * Rembourser un paiement
     */
    public function refund(string $paymentIntentId): Refund
    {
        return Refund::create([
            'payment_intent' => $paymentIntentId,
        ]);
    }

    /**
     * Créer un coupon
     */
    public function createCoupon(array $data): Coupon
    {
        return Coupon::create([
            'name'              => $data['name'],
            'percent_off'       => $data['discount_type'] === 'percent' ? $data['discount_value'] : null,
            'amount_off'        => $data['discount_type'] === 'fixed' ? $data['discount_value'] * 100 : null,
            'currency'          => 'eur',
            'duration'          => 'once',
            'max_redemptions'   => $data['max_uses'] ?? null,
            'redeem_by'         => isset($data['expires_at']) ? strtotime($data['expires_at']) : null,
        ]);
    }

    /**
     * Lister les paiements
     */
    public function getPayments(int $limit = 20): array
    {
        $charges = \Stripe\Charge::all(['limit' => $limit]);
        return $charges->data;
    }

    /**
     * Lister les coupons
     */
    public function getCoupons(): array
    {
        $coupons = Coupon::all(['limit' => 100]);
        return $coupons->data;
    }

    /**
     * Supprimer un coupon
     */
    public function deleteCoupon(string $couponId): void
    {
        $coupon = Coupon::retrieve($couponId);
        $coupon->delete();
    }
}
