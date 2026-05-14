<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Competence;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        // Récupération de l'admin
        $admin = User::where('email', 'admin@kidelya.com')->first();

        $themes = Theme::all();
        $competences = Competence::all();

        $activities = [
            [
                'title'       => 'Atelier peinture',
                'description' => 'Découverte de la peinture aquarelle pour les enfants.',
                'agemin'      => 5,
                'agemax'      => 12,
                'duration'    => 60,
                'season'      => 'Spring',
                'location'    => 'Salle d\'art',
                'photourl'    => null,
                'iduser'      => $admin->iduser,
            ],
            [
                'title'       => 'Randonnée en forêt',
                'description' => 'Exploration de la nature et découverte de la faune locale.',
                'agemin'      => 6,
                'agemax'      => 15,
                'duration'    => 120,
                'season'      => 'Summer',
                'location'    => 'Forêt de Soignes',
                'photourl'    => null,
                'iduser'      => $admin->iduser,
            ],
            [
                'title'       => 'Initiation à la musique',
                'description' => 'Apprentissage des bases musicales avec instruments.',
                'agemin'      => 4,
                'agemax'      => 10,
                'duration'    => 45,
                'season'      => 'Winter',
                'location'    => 'Salle de musique',
                'photourl'    => null,
                'iduser'      => $admin->iduser,
            ],
            [
                'title'       => 'Atelier cuisine',
                'description' => 'Préparation de recettes simples et saines.',
                'agemin'      => 7,
                'agemax'      => 14,
                'duration'    => 90,
                'season'      => 'Autumn',
                'location'    => 'Cuisine pédagogique',
                'photourl'    => null,
                'iduser'      => $admin->iduser,
            ],
            [
                'title'       => 'Initiation au code',
                'description' => 'Découverte de la programmation via des jeux interactifs.',
                'agemin'      => 8,
                'agemax'      => 16,
                'duration'    => 60,
                'season'      => 'Winter',
                'location'    => 'Salle informatique',
                'photourl'    => null,
                'iduser'      => $admin->iduser,
            ],
        ];

        foreach ($activities as $data) {
            $activity = Activity::firstOrCreate(
                ['title' => $data['title']],
                $data
            );

            // Associer 1 à 3 thèmes
            $activity->themes()->syncWithoutDetaching(
                $themes->random(rand(1, 3))->pluck('idtheme')->toArray()
            );

            // Associer 1 à 3 compétences
            $activity->competences()->syncWithoutDetaching(
                $competences->random(rand(1, 3))->pluck('idcompetence')->toArray()
            );
        }
    }
}
