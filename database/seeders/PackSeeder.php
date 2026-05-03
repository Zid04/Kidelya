<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Pack;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeder pour les packs.
 *
 * Crée des packs de démonstration avec leurs activités associées.
 * Dépend de UserSeeder et ActivitySeeder.
 */
class PackSeeder extends Seeder
{
    public function run(): void
    {
        $admin      = User::where('Email', 'admin@kidelya.com')->first();
        $activities = Activity::all();

        $packs = [
            [
                'Title'        => 'Pack Découverte',
                'Description'  => 'Idéal pour débuter avec des activités variées.',
                'Tarification' => 29.99,
                'Duration'     => 30,
                'CreatedBy'    => $admin->IdUser,
            ],
            [
                'Title'        => 'Pack Premium',
                'Description'  => 'Accès illimité à toutes les activités pendant 3 mois.',
                'Tarification' => 79.99,
                'Duration'     => 90,
                'CreatedBy'    => $admin->IdUser,
            ],
            [
                'Title'        => 'Pack Annuel',
                'Description'  => 'Le meilleur rapport qualité/prix pour une année complète.',
                'Tarification' => 199.99,
                'Duration'     => 365,
                'CreatedBy'    => $admin->IdUser,
            ],
        ];

        foreach ($packs as $packData) {
            $pack = Pack::firstOrCreate(
                ['Title' => $packData['Title']],
                $packData
            );

            // Association de 2 à 3 activités par pack
            if ($activities->count() > 0) {
                $pack->activities()->syncWithoutDetaching(
                    $activities->random(min(2, $activities->count()))
                               ->pluck('IdActivities')
                               ->toArray()
                );
            }
        }
    }
}