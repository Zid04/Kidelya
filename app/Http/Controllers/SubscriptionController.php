<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        return SubscriptionPlan::where('is_active', true)->get();
    }

    public function subscribe(Request $request, SubscriptionService $service)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,idplan',
        ]);

        $plan = SubscriptionPlan::find($request->plan_id);

        $service->subscribe($request->user(), $plan);

        return response()->json(['message' => 'Subscription activated']);
    }

    public function cancel(Request $request, SubscriptionService $service)
    {
        $service->cancel($request->user());

        return response()->json(['message' => 'Subscription canceled']);
    }

    public function status(Request $request)
    {
        return $request->user()->subscription;
    }
}
