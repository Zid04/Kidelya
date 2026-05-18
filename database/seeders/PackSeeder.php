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
        // 1. Admin
        $admin = User::whereHas('role', fn($q) => $q->where('type', 'Admin'))->first();

        if (!$admin) {
            $this->command->warn(" PackSeeder skipped: no admin found.");
            return;
        }

        // 2. Activités publiées
        $activities = Activity::where('is_published', true)->get();

        // 3. Packs
        $packs = [
            [
                'title'        => 'Pack Découverte',
                'description'  => 'Idéal pour débuter avec des activités variées.',
                'tarification' => 29.99,
                'duration'     => 30,
                'type'         => 'monthly',
                'is_published' => true,
                'createdby'    => $admin->iduser,
                'illustration' => null, 
            ],
            [
                'title'        => 'Pack Premium',
                'description'  => 'Accès illimité à toutes les activités pendant 3 mois.',
                'tarification' => 79.99,
                'duration'     => 90,
                'type'         => 'quarterly',
                'is_published' => true,
                'createdby'    => $admin->iduser,
                'illustration' => null, 
            ],
            [
                'title'        => 'Pack Annuel',
                'description'  => 'Le meilleur rapport qualité/prix pour une année complète.',
                'tarification' => 199.99,
                'duration'     => 365,
                'type'         => 'yearly',
                'is_published' => true,
                'createdby'    => $admin->iduser,
                'illustration' => null, 
            ],
        ];

        // 4. Création + attachement activités
        foreach ($packs as $data) {

            $pack = Pack::firstOrCreate(
                ['title' => $data['title']],
                $data
            );

            if ($activities->count() > 0) {
                $selected = $activities->random(min(3, $activities->count()));

                $activityIds = $selected instanceof \Illuminate\Support\Collection
                    ? $selected->pluck('idactivities')->toArray()
                    : [$selected->idactivities];

                $pack->activities()->syncWithoutDetaching($activityIds);
            }
        }
    }
}
