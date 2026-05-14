<?php

namespace App\Services;

use App\Models\Pack;
use App\Models\User;
use App\Models\PackUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PackUserService
{
    /**
     * Activer un abonnement pour un utilisateur
     */
    public function activate(User $user, Pack $pack): PackUser
    {
        return DB::transaction(function () use ($user, $pack) {

            // Date actuelle
            $start = Carbon::now();

            // Expiration = maintenant + durée du pack
            $end = Carbon::now()->addDays($pack->duration);

            // Création de l'abonnement
            return PackUser::create([
                'iduser'          => $user->iduser,
                'idpack'          => $pack->idpack,
                'subscriptiondate'=> $start,
                'expirationdate'  => $end,
                'status'          => 'active',
            ]);
        });
    }

    /**
     * Désactiver un abonnement (manuel ou automatique)
     */
    public function deactivate(PackUser $subscription): PackUser
    {
        $subscription->update([
            'status' => 'expired',
        ]);

        return $subscription;
    }

    /**
     * Renouveler un abonnement (ex: Stripe webhook)
     */
    public function renew(PackUser $subscription): PackUser
    {
        $newExpiration = Carbon::parse($subscription->expirationdate)
            ->addDays($subscription->pack->duration);

        $subscription->update([
            'expirationdate' => $newExpiration,
            'status'         => 'active',
        ]);

        return $subscription;
    }

    /**
     * Vérifier si un abonnement est actif
     */
    public function isActive(PackUser $subscription): bool
    {
        return $subscription->status === 'active'
            && Carbon::parse($subscription->expirationdate)->isFuture();
    }

    /**
     * Vérifier et désactiver automatiquement les abonnements expirés
     */
    public function checkExpired(): int
    {
        $expired = PackUser::where('status', 'active')
            ->whereDate('expirationdate', '<', Carbon::today())
            ->get();

        foreach ($expired as $sub) {
            $this->deactivate($sub);
        }

        return $expired->count();
    }
}
