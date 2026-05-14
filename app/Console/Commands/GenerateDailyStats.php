<?php

namespace App\Console\Commands;

use App\Models\PackUser;
use App\Models\SubscriptionStat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateDailyStats extends Command
{
    protected $signature   = 'stats:generate-daily';
    protected $description = 'Génère le snapshot quotidien des statistiques d\'abonnement';

    public function handle(): void
{
    $today = now()->toDateString();

    $totalActive  = PackUser::where('status', 'active')->count();
    $totalExpired = PackUser::where('status', 'inactive')->count();  

    $newSubscriptions = PackUser::whereDate('created_at', $today)->count();

    $churned = PackUser::where('status', 'canceled')  
        ->whereDate('updated_at', $today)             
        ->count();

    $revenue = PackUser::with('pack')
        ->whereDate('created_at', $today)
        ->where('status', 'active')
        ->get()
        ->sum(fn($sub) => $sub->pack->price ?? 0);

    SubscriptionStat::updateOrCreate(
        ['date' => $today],
        [
            'total_active'      => $totalActive,
            'total_expired'     => $totalExpired,
            'new_subscriptions' => $newSubscriptions,
            'churned'           => $churned,
            'revenue'           => $revenue,
        ]
    );

    $this->info("Snapshot du {$today} généré avec succès.");

    Log::info('Stats quotidiennes générées', [
        'date'              => $today,
        'total_active'      => $totalActive,
        'new_subscriptions' => $newSubscriptions,
        'churned'           => $churned,
        'revenue'           => $revenue,
    ]);
}
}