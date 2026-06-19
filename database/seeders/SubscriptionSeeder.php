<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\PackUser;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereIn('email', ['user@kidelya.com', 'user2@kidelya.com'])->get();
        $packs = Pack::where('is_published', true)->get();

        if ($users->count() === 0 || $packs->count() === 0) {
            $this->command->warn(' SubscriptionSeeder skipped: missing users or packs.');

            return;
        }

        // ── Abonnements globaux (Monthly / Annual) ──────────────────────────
        $monthlyPlan = SubscriptionPlan::where('name', 'Monthly')->first();
        $annualPlan = SubscriptionPlan::where('name', 'Annual')->first();

        if ($monthlyPlan && $users->count() >= 1) {
            // user@kidelya.com → Monthly actif
            UserSubscription::firstOrCreate(
                ['iduser' => $users[0]->iduser, 'idplan' => $monthlyPlan->idplan],
                [
                    'starts_at' => Carbon::now()->subDays(5),
                    'ends_at' => Carbon::now()->addDays(25),
                    'status' => 'active',
                ]
            );
        }

        if ($annualPlan && $users->count() >= 2) {
            // user2@kidelya.com → Annual actif
            UserSubscription::firstOrCreate(
                ['iduser' => $users[1]->iduser, 'idplan' => $annualPlan->idplan],
                [
                    'starts_at' => Carbon::now()->subMonths(2),
                    'ends_at' => Carbon::now()->addMonths(10),
                    'status' => 'active',
                ]
            );
        }

        // ── Abonnements packs (PackUser) ─────────────────────────────────────
        foreach ($users as $index => $user) {
            // Pack différent pour chaque user
            $pack = $packs->get($index % $packs->count());

            // Abonnement actif
            PackUser::firstOrCreate(
                [
                    'iduser' => $user->iduser,
                    'idpack' => $pack->idpack,
                    'status' => 'active',
                ],
                [
                    'subscriptiondate' => Carbon::now()->subDays(5),
                    'expirationdate' => Carbon::now()->addDays($pack->duration),
                ]
            );

            // Abonnement expiré sur un autre pack
            $expiredPack = $packs->get(($index + 1) % $packs->count());
            PackUser::firstOrCreate(
                [
                    'iduser' => $user->iduser,
                    'idpack' => $expiredPack->idpack,
                    'status' => 'inactive',
                ],
                [
                    'subscriptiondate' => Carbon::now()->subDays(60),
                    'expirationdate' => Carbon::now()->subDays(30),
                ]
            );
        }
    }
}
