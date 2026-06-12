<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(auth()->user()?->role?->type === 'Admin', 403);

        $stats = SubscriptionStat::orderBy('date', 'desc')->paginate(30);

        return response()->json([
            'data' => [
                'data' => $stats->items(),
                'pagination' => [
                    'total' => $stats->total(),
                    'per_page' => $stats->perPage(),
                    'current_page' => $stats->currentPage(),
                    'last_page' => $stats->lastPage(),
                ]
            ]
        ]);
    }

    public function today(): JsonResponse
    {
        abort_unless(auth()->user()?->role?->type === 'Admin', 403);

        $today = SubscriptionStat::where('date', now()->toDateString())->first();

        return response()->json([
            'data' => [
                'data' => $today
            ]
        ]);
    }

    public function summary(): JsonResponse
    {
        abort_unless(auth()->user()?->role?->type === 'Admin', 403);

        $data = Cache::remember('stats_summary_' . now()->format('Ymd'), 300, function () {
            $packActive = \App\Models\PackUser::where('status', 'active')->count();
            $planActive = \App\Models\UserSubscription::where('status', 'active')->count();

            return [
                'total_active'  => $packActive + $planActive,
                'revenue_month' => SubscriptionStat::whereMonth('date', now()->month)->sum('revenue'),
                'new_subs'      => SubscriptionStat::whereMonth('date', now()->month)->sum('new_subscriptions'),
                'churned'       => SubscriptionStat::whereMonth('date', now()->month)->sum('churned'),
            ];
        });

        return response()->json(['data' => ['data' => $data]]);
    }
}