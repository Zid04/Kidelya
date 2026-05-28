<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Subscription as StripeSubscription;

class StripeSubscriptionController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,idplan',
        ]);

        $plan = SubscriptionPlan::find($request->plan_id);

        if ($plan->price == 0) {
            return response()->json(['error' => 'Free plan does not require Stripe'], 400);
        }

        $priceId = match ($plan->name) {
            'Monthly' => env('STRIPE_PRICE_MONTHLY'),
            'Annual'  => env('STRIPE_PRICE_ANNUAL'),
        };

        $session = $request->user()->checkout([$priceId => 1], [
            'success_url' => url('/stripe/subscription/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url'  => url('/stripe/subscription/cancel'),
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function success(Request $request, SubscriptionService $service)
    {
        $session = StripeSession::retrieve($request->session_id);

        $stripeSubscription = StripeSubscription::retrieve($session->subscription);

        $priceId = $stripeSubscription->items->data[0]->price->id;

        $plan = match ($priceId) {
            env('STRIPE_PRICE_MONTHLY') => SubscriptionPlan::where('name', 'Monthly')->first(),
            env('STRIPE_PRICE_ANNUAL')  => SubscriptionPlan::where('name', 'Annual')->first(),
        };

        $service->subscribe($request->user(), $plan);

        return redirect('/dashboard')->with('success', 'Subscription activated');
    }

    public function cancel(Request $request)
    {
        $request->user()->subscription('default')->cancel();

        return response()->json(['message' => 'Subscription canceled']);
    }
}
