<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Competence;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeder pour les activités.
 *
 * Crée des activités de démonstration avec leurs
 * thèmes et compétences associés.
 * Dépend de UserSeeder, ThemeSeeder, CompetenceSeeder.
 */
class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        // Récupération de l'admin pour associer les activités
        $admin  = User::where('Email', 'admin@kidelya.com')->first();
        $themes = Theme::all();
        $competences = Competence::all();

        $activities = [
            [
                'Title'       => 'Atelier peinture',
                'Description' => 'Découverte de la peinture aquarelle pour les enfants.',
                'AgeMin'      => 5,
                'AgeMax'      => 12,
                'Duration'    => 60,
                'Season'      => 'Spring',
                'Location'    => 'Salle d\'art',
                'PhotoUrl'    => null,
                'IdUser'      => $admin->IdUser,
            ],
            [
                'Title'       => 'Randonnée en forêt',
                'Description' => 'Exploration de la nature et découverte de la faune locale.',
                'AgeMin'      => 6,
                'AgeMax'      => 15,
                'Duration'    => 120,
                'Season'      => 'Summer',
                'Location'    => 'Forêt de Soignes',
                'PhotoUrl'    => null,
                'IdUser'      => $admin->IdUser,
            ],
            [
                'Title'       => 'Initiation à la musique',
                'Description' => 'Apprentissage des bases musicales avec instruments.',
                'AgeMin'      => 4,
                'AgeMax'      => 10,
                'Duration'    => 45,
                'Season'      => 'Winter',
                'Location'    => 'Salle de musique',
                'PhotoUrl'    => null,
                'IdUser'      => $admin->IdUser,
            ],
            [
                'Title'       => 'Atelier cuisine',
                'Description' => 'Préparation de recettes simples et saines.',
                'AgeMin'      => 7,
                'AgeMax'      => 14,
                'Duration'    => 90,
                'Season'      => 'Autumn',
                'Location'    => 'Cuisine pédagogique',
                'PhotoUrl'    => null,
                'IdUser'      => $admin->IdUser,
            ],
            [
                'Title'       => 'Initiation au code',
                'Description' => 'Découverte de la programmation via des jeux interactifs.',
                'AgeMin'      => 8,
                'AgeMax'      => 16,
                'Duration'    => 60,
                'Season'      => 'Winter',
                'Location'    => 'Salle informatique',
                'PhotoUrl'    => null,
                'IdUser'      => $admin->IdUser,
            ],
        ];

        foreach ($activities as $activityData) {
            $activity = Activity::firstOrCreate(
                ['Title' => $activityData['Title']],
                $activityData
            );

            // Association aléatoire de 1 à 3 thèmes par activité
            $activity->themes()->syncWithoutDetaching(
                $themes->random(rand(1, 3))->pluck('IdTheme')->toArray()
            );

            // Association aléatoire de 1 à 3 compétences par activité
            $activity->competences()->syncWithoutDetaching(
                $competences->random(rand(1, 3))->pluck('IdCompetence')->toArray()
            );
        }
    }
}