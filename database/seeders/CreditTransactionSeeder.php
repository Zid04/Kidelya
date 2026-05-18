<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Models\CreditTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class CreditTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users      = User::whereHas('role', fn($q) => $q->where('type', 'User'))->get();
        $activities = Activity::where('is_purchasable', true)
                              ->where('is_published', true)
                              ->get();

        if ($users->count() === 0 || $activities->count() === 0) {
            $this->command->warn("⚠️ CreditTransactionSeeder skipped: missing users or activities.");
            return;
        }

        foreach ($users as $user) {

            // Bonus crédits
            CreditTransaction::create([
                'user_id'     => $user->iduser,
                'amount'      => 50,
                'type'        => 'bonus',
                'activity_id' => null,
                'ref_stripe'  => null,
            ]);
            $user->increment('credit_balance', 50);

            // Achat d'une activité avec crédits
            $activity = $activities->random();

            if ($user->credit_balance >= $activity->credit_price) {
                CreditTransaction::create([
                    'user_id'     => $user->iduser,
                    'amount'      => -$activity->credit_price,
                    'type'        => 'conso',
                    'activity_id' => $activity->idactivities,
                    'ref_stripe'  => null,
                ]);

                // Historique achat
                ActivityPurchase::firstOrCreate(
                    [
                        'user_id'     => $user->iduser,
                        'activity_id' => $activity->idactivities,
                    ],
                    [
                        'credits_spent' => $activity->credit_price,
                    ]
                );

                $user->decrement('credit_balance', $activity->credit_price);
            }
        }
    }
}