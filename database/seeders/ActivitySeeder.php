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
        $admin = User::whereHas('role', fn($q) => $q->where('type', 'Admin'))->first();
        $users = User::whereHas('role', fn($q) => $q->where('type', 'User'))->take(2)->get();

        if (!$admin || $users->count() < 2) {
            $this->command->warn(" ActivitySeeder skipped: missing admin or users.");
            return;
        }

        $user1 = $users[0];
        $user2 = $users[1];

        $themes      = Theme::all();
        $competences = Competence::all();

        $activities = [
            [
                'title'          => 'Atelier peinture',
                'description'    => 'Découverte de la peinture aquarelle pour les enfants.',
                'agemin'         => 5,
                'agemax'         => 12,
                'duration'       => 60,
                'season'         => 'Spring',
                'location'       => 'Salle d\'art',
                'photourl'       => null,
                'credit_price'   => 10,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Randonnée en forêt',
                'description'    => 'Exploration de la nature et découverte de la faune locale.',
                'agemin'         => 6,
                'agemax'         => 15,
                'duration'       => 120,
                'season'         => 'Summer',
                'location'       => 'Forêt de Soignes',
                'photourl'       => null,
                'credit_price'   => 15,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Initiation à la musique',
                'description'    => 'Apprentissage des bases musicales avec instruments.',
                'agemin'         => 4,
                'agemax'         => 10,
                'duration'       => 45,
                'season'         => 'Winter',
                'location'       => 'Salle de musique',
                'photourl'       => null,
                'credit_price'   => 8,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Atelier cuisine',
                'description'    => 'Préparation de recettes simples et saines.',
                'agemin'         => 7,
                'agemax'         => 14,
                'duration'       => 90,
                'season'         => 'Autumn',
                'location'       => 'Cuisine pédagogique',
                'photourl'       => null,
                'credit_price'   => 12,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Initiation au code',
                'description'    => 'Découverte de la programmation via des jeux interactifs.',
                'agemin'         => 8,
                'agemax'         => 16,
                'duration'       => 60,
                'season'         => 'Winter',
                'location'       => 'Salle informatique',
                'photourl'       => null,
                'credit_price'   => 20,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Yoga enfants',
                'description'    => 'Séance de yoga adaptée aux enfants.',
                'agemin'         => 4,
                'agemax'         => 12,
                'duration'       => 45,
                'season'         => 'Spring',
                'location'       => 'Salle de sport',
                'photourl'       => null,
                'credit_price'   => 5,
                'is_purchasable' => true,
                'is_published'   => true,
                'iduser'         => $admin->iduser,
            ],
            [
                'title'          => 'Sortie au parc',
                'description'    => 'Activité plein air au parc avec jeux libres.',
                'agemin'         => 3,
                'agemax'         => 10,
                'duration'       => 90,
                'season'         => 'Spring',
                'location'       => 'Parc municipal',
                'photourl'       => null,
                'credit_price'   => null,
                'is_purchasable' => false,
                'is_published'   => false,
                'iduser'         => $user1->iduser,
            ],
            [
                'title'          => 'Lecture illustrée',
                'description'    => 'Séance de lecture avec livres illustrés.',
                'agemin'         => 2,
                'agemax'         => 6,
                'duration'       => 30,
                'season'         => 'Winter',
                'location'       => 'Bibliothèque',
                'photourl'       => null,
                'credit_price'   => null,
                'is_purchasable' => false,
                'is_published'   => false,
                'iduser'         => $user1->iduser,
            ],
            [
                'title'          => 'Atelier dessin',
                'description'    => 'Dessin libre avec crayons de couleur.',
                'agemin'         => 4,
                'agemax'         => 10,
                'duration'       => 45,
                'season'         => 'Autumn',
                'location'       => 'Maison',
                'photourl'       => null,
                'credit_price'   => null,
                'is_purchasable' => false,
                'is_published'   => false,
                'iduser'         => $user2->iduser,
            ],
            [
                'title'          => 'Jeux de société',
                'description'    => 'Soirée jeux de société en famille.',
                'agemin'         => 5,
                'agemax'         => 14,
                'duration'       => 120,
                'season'         => 'Winter',
                'location'       => 'Salon',
                'photourl'       => null,
                'credit_price'   => null,
                'is_purchasable' => false,
                'is_published'   => false,
                'iduser'         => $user2->iduser,
            ],
        ];

        foreach ($activities as $data) {
            $activity = Activity::firstOrCreate(
                ['title' => $data['title'], 'iduser' => $data['iduser']],
                $data
            );

            // Thèmes — collect() force toujours une collection
            if ($themes->count() > 0) {
                $count    = min(rand(1, 2), $themes->count());
                $selected = $themes->random($count);
                $themeIds = collect($selected)->pluck('idtheme')->toArray();
                $activity->themes()->syncWithoutDetaching($themeIds);
            }

            // Compétences — collect() force toujours une collection
            if ($competences->count() > 0) {
                $count         = min(rand(1, 2), $competences->count());
                $selected      = $competences->random($count);
                $competenceIds = collect($selected)->pluck('idcompetence')->toArray();
                $activity->competences()->syncWithoutDetaching($competenceIds);
            }
        }
    }
}