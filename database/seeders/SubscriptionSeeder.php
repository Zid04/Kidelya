<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\PackUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereHas('role', fn($q) => $q->where('type', 'User'))->get();
        $packs = Pack::where('is_published', true)->get();

        if ($users->count() === 0 || $packs->count() === 0) {
            $this->command->warn(" SubscriptionSeeder skipped: missing users or packs.");
            return;
        }

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
                    'expirationdate'   => Carbon::now()->addDays($pack->duration),
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
                    'expirationdate'   => Carbon::now()->subDays(30),
                ]
            );
        }
    }
}