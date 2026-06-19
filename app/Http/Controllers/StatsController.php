<?php

namespace App\Http\Controllers;

use App\Models\PackUser;
use App\Models\UserSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(auth()->user()?->role?->type === 'Admin', 403);

        $month = now()->month;
        $year = now()->year;

        // Revenus + nouveaux abonnés par jour (packs)
        $packByDay = DB::table('packs_user')
            ->join('packs', 'packs_user.idpack', '=', 'packs.idpack')
            ->selectRaw('DATE(packs_user.created_at) as date, SUM(packs.tarification) as revenue, COUNT(*) as new_subs')
            ->whereMonth('packs_user.created_at', $month)
            ->whereYear('packs_user.created_at', $year)
            ->groupByRaw('DATE(packs_user.created_at)')
            ->get()
            ->keyBy('date');

        // Revenus + nouveaux abonnés par jour (plans Stripe)
        $planByDay = DB::table('user_subscriptions')
            ->join('subscription_plans', 'user_subscriptions.idplan', '=', 'subscription_plans.idplan')
            ->selectRaw('DATE(user_subscriptions.created_at) as date, SUM(subscription_plans.price) as revenue, COUNT(*) as new_subs')
            ->whereMonth('user_subscriptions.created_at', $month)
            ->whereYear('user_subscriptions.created_at', $year)
            ->groupByRaw('DATE(user_subscriptions.created_at)')
            ->get()
            ->keyBy('date');

        // Résiliations par jour
        $churnByDay = DB::table('packs_user')
            ->selectRaw('DATE(updated_at) as date, COUNT(*) as churned')
            ->whereIn('status', ['inactive', 'canceled'])
            ->whereMonth('updated_at', $month)
            ->whereYear('updated_at', $year)
            ->groupByRaw('DATE(updated_at)')
            ->get()
            ->keyBy('date');

        // Générer les 30 derniers jours
        $days = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $pack = $packByDay[$date] ?? null;
            $plan = $planByDay[$date] ?? null;
            $churn = $churnByDay[$date] ?? null;

            $days->push([
                'date' => $date,
                'new_subscriptions' => ($pack?->new_subs ?? 0) + ($plan?->new_subs ?? 0),
                'revenue' => round(($pack?->revenue ?? 0) + ($plan?->revenue ?? 0), 2),
                'churned' => $churn?->churned ?? 0,
                'total_active' => 0,
            ]);
        }

        return response()->json(['data' => $days]);
    }

    public function summary(): JsonResponse
    {
        abort_unless(auth()->user()?->role?->type === 'Admin', 403);

        $data = Cache::remember('stats_summary_'.now()->format('Ymd'), 300, function () {
            $month = now()->month;
            $year = now()->year;

            $packActive = PackUser::where('status', 'active')->count();
            $planActive = UserSubscription::where('status', 'active')->count();

            $packRevenue = DB::table('packs_user')
                ->join('packs', 'packs_user.idpack', '=', 'packs.idpack')
                ->whereMonth('packs_user.created_at', $month)
                ->whereYear('packs_user.created_at', $year)
                ->sum('packs.tarification');

            $planRevenue = DB::table('user_subscriptions')
                ->join('subscription_plans', 'user_subscriptions.idplan', '=', 'subscription_plans.idplan')
                ->whereMonth('user_subscriptions.created_at', $month)
                ->whereYear('user_subscriptions.created_at', $year)
                ->sum('subscription_plans.price');

            $newPacks = PackUser::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();
            $newPlans = UserSubscription::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();

            $churnedPacks = PackUser::whereIn('status', ['inactive', 'canceled'])
                ->whereMonth('updated_at', $month)->whereYear('updated_at', $year)->count();
            $churnedPlans = UserSubscription::whereIn('status', ['expired', 'canceled'])
                ->whereMonth('updated_at', $month)->whereYear('updated_at', $year)->count();

            return [
                'total_active' => $packActive + $planActive,
                'revenue_month' => round($packRevenue + $planRevenue, 2),
                'new_subs' => $newPacks + $newPlans,
                'churned' => $churnedPacks + $churnedPlans,
            ];
        });

        return response()->json(['data' => $data]);
    }
}
