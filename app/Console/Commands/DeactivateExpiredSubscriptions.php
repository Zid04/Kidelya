<?php

namespace App\Console\Commands;

use App\Models\PackUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Notifications\SubscriptionExpiringNotification;
use App\Notifications\SubscriptionExpiredNotification;

class DeactivateExpiredSubscriptions extends Command
{
    protected $signature   = 'subscriptions:deactivate-expired';
    protected $description = 'Désactive automatiquement les abonnements dont la date de fin est dépassée';

  public function handle(): void
{
    // Rappel 3 jours avant expiration
    $expiringSoon = PackUser::where('status', 'active')
        ->whereDate('expirationdate', now()->addDays(3)->toDateString())
        ->with(['user', 'pack'])
        ->get();

    foreach ($expiringSoon as $subscription) {
        $subscription->user->notify(new SubscriptionExpiringNotification($subscription));
        $this->info("Rappel envoyé à {$subscription->user->email}");
    }

    // Désactivation + notification expirés
    $expired = PackUser::where('status', 'active')
        ->where('expirationdate', '<=', now())
        ->with(['user', 'pack'])
        ->get();

    foreach ($expired as $subscription) {
        $subscription->update(['status' => 'inactive']);
        $subscription->user->notify(new SubscriptionExpiredNotification($subscription));
        $this->info("Abonnement expiré : {$subscription->user->email}");
    }

    $this->info("Traitement terminé.");
}

}