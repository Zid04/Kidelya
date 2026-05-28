<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
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
        $today = SubscriptionStat::where('date', now()->toDateString())->first();

        return response()->json([
            'data' => [
                'data' => $today
            ]
        ]);
    }

  public function summary(): JsonResponse
{
    $data = Cache::remember('stats_summary_' . now()->format('Ymd'), 300, function () {

        // Abonnements aux packs (packs_user)
        $packActive = \App\Models\PackUser::where('status', 'active')->count();

        // Abonnements aux plans (user_subscriptions)
        $planActive = \App\Models\UserSubscription::where('status', 'active')->count();

        return [
            // total_active = packs actifs + plans actifs
            'total_active'  => ($packActive + $planActive),

            // revenu du mois (déjà correct)
            'revenue_month' => SubscriptionStat::whereMonth('date', now()->month)->sum('revenue'),

            // nouveaux abonnements du mois (déjà correct)
            'new_subs'      => SubscriptionStat::whereMonth('date', now()->month)->sum('new_subscriptions'),

            //  churn (déjà correct)
            'churned'       => SubscriptionStat::whereMonth('date', now()->month)->sum('churned'),
        ];
    });

    return response()->json([
        'data' => [
            'data' => $data
        ]
    ]);
}
}