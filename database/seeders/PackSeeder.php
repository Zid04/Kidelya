<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Pack;
use App\Models\User;
use Illuminate\Database\Seeder;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        // Récupération de l'admin
        $admin = User::where('email', 'admin@kidelya.com')->first();
        $activities = Activity::all();

        $packs = [
            [
                'title'        => 'Pack Découverte',
                'description'  => 'Idéal pour débuter avec des activités variées.',
                'tarification' => 29.99,
                'duration'     => 30,
                'createdby'    => $admin->iduser,
            ],
            [
                'title'        => 'Pack Premium',
                'description'  => 'Accès illimité à toutes les activités pendant 3 mois.',
                'tarification' => 79.99,
                'duration'     => 90,
                'createdby'    => $admin->iduser,
            ],
            [
                'title'        => 'Pack Annuel',
                'description'  => 'Le meilleur rapport qualité/prix pour une année complète.',
                'tarification' => 199.99,
                'duration'     => 365,
                'createdby'    => $admin->iduser,
            ],
        ];

        foreach ($packs as $data) {
            $pack = Pack::firstOrCreate(
                ['title' => $data['title']],
                $data
            );

            // Associer 2 à 3 activités
            if ($activities->count() > 0) {
                $pack->activities()->syncWithoutDetaching(
                    $activities
                        ->random(min(3, max(2, $activities->count())))
                        ->pluck('idactivities')
                        ->toArray()
                );
            }
        }
    }
}
