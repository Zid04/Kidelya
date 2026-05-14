<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', SubscriptionStat::class);

        return response()->json([
            'data' => SubscriptionStat::orderBy('date', 'desc')->paginate(30)
        ]);
    }

    public function today(): JsonResponse
    {
        $this->authorize('viewAny', SubscriptionStat::class);

        $today = SubscriptionStat::where('date', now()->toDateString())->first();

        return response()->json([
            'data' => $today
        ]);
    }

    public function summary(): JsonResponse
    {
        $this->authorize('viewAny', SubscriptionStat::class);

        return response()->json([
            'total_active'  => SubscriptionStat::latest()->value('total_active'),
            'revenue_month' => SubscriptionStat::whereMonth('date', now()->month)->sum('revenue'),
            'new_subs'      => SubscriptionStat::whereMonth('date', now()->month)->sum('new_subscriptions'),
            'churned'       => SubscriptionStat::whereMonth('date', now()->month)->sum('churned'),
        ]);
     return response()->json($data);
}
   
}
