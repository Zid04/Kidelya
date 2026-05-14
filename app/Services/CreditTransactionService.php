<?php

namespace App\Services;

use App\Models\User;
use App\Models\Activity;
use App\Models\CreditTransaction;
use App\Models\ActivityPurchase;
use Illuminate\Support\Facades\DB;

class CreditTransactionService
{
    /**
     * Ajouter des crédits à un utilisateur
     */
    public function addCredits(User $user, int $amount, ?string $refStripe = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $refStripe) {

            // Mise à jour du solde
            $user->increment('credit_balance', $amount);

            // Transaction
            return CreditTransaction::create([
                'user_id'    => $user->iduser,
                'amount'     => $amount,
                'type'       => 'achat',
                'ref_stripe' => $refStripe,
            ]);
        });
    }

    /**
     * Consommer des crédits (ex: achat d’activité)
     */
    public function consumeCredits(User $user, Activity $activity): CreditTransaction
    {
        if ($user->credit_balance < $activity->credit_price) {
            throw new \Exception("Solde insuffisant");
        }

        return DB::transaction(function () use ($user, $activity) {

            // Mise à jour du solde
            $user->decrement('credit_balance', $activity->credit_price);

            // Transaction
            $transaction = CreditTransaction::create([
                'user_id'     => $user->iduser,
                'amount'      => -$activity->credit_price,
                'type'        => 'conso',
                'activity_id' => $activity->idactivities,
            ]);

            // Historique d’achat
            ActivityPurchase::create([
                'user_id'       => $user->iduser,
                'activity_id'   => $activity->idactivities,
                'credits_spent' => $activity->credit_price,
            ]);

            return $transaction;
        });
    }
}
