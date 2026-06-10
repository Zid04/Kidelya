<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class StripeSubscriptionController extends Controller
{
    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,idplan',
        ]);

        $plan = SubscriptionPlan::find($request->plan_id);

        if ($plan->price == 0) {
            return response()->json(['error' => 'Le plan gratuit ne nécessite pas de paiement.'], 400);
        }

        $priceId = match ($plan->name) {
            'Monthly' => env('STRIPE_PRICE_MONTHLY'),
            'Annual'  => env('STRIPE_PRICE_ANNUAL'),
            default   => null,
        };

        if (!$priceId) {
            return response()->json(['error' => 'Plan non configuré dans Stripe. Vérifiez STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL.'], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $user = $request->user();

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'subscription',
            'customer_email'       => $user->email,
            'metadata'             => [
                'user_id' => $user->iduser,
                'plan_id' => $plan->idplan,
                'type'    => 'subscription',
            ],
            'line_items' => [[
                'price'    => $priceId,
                'quantity' => 1,
            ]],
            'success_url' => config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/payment/failed',
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function cancel(Request $request, SubscriptionService $service): JsonResponse
    {
        $service->cancel($request->user());
        return response()->json(['message' => 'Abonnement annulé.']);
    }
}
