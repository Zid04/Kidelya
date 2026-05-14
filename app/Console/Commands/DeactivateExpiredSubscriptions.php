<?php

namespace App\Console\Commands;

use App\Models\PackUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DeactivateExpiredSubscriptions extends Command
{
    protected $signature   = 'subscriptions:deactivate-expired';
    protected $description = 'Désactive automatiquement les abonnements dont la date de fin est dépassée';

   public function handle(): void
{
    $expired = PackUser::where('status', 'active')
        ->where('expirationdate', '<=', now()) 
        ->get();

    if ($expired->isEmpty()) {
        $this->info('Aucun abonnement expiré trouvé.');
        return;
    }

    foreach ($expired as $subscription) {
        $subscription->update([
            'status' => 'inactive',  
        ]);

        Log::info('Abonnement expiré désactivé', [
            'subscription_id' => $subscription->idpackuser,
            'user_id'         => $subscription->iduser,
            'pack_id'         => $subscription->idpack,
            'ended_at'        => $subscription->expirationdate,
        ]);
    }

    $this->info("{$expired->count()} abonnement(s) désactivé(s).");
}
}