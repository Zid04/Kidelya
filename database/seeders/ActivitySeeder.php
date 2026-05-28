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

        // ───────────────────────────────────────────────
        // ACTIVITÉS PUBLIÉES (vendues par crédits)
        // ───────────────────────────────────────────────
        $published = [

            // 🌿 Nature & Printemps
            [
                'title' => 'Plantation de graines',
                'description' => 'Découverte du jardinage : planter, arroser et observer la croissance.',
                'agemin' => 4, 'agemax' => 12, 'duration' => 45,
                'season' => 'Spring', 'location' => 'Jardin pédagogique',
                'photourl' => '/assets/activities/plantation.jpg',
                'steps' => json_encode(['Préparer le pot', 'Mettre la terre', 'Planter les graines', 'Arroser']),
                'category' => 'Nature', 'difficulty' => 'Facile',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Découverte des insectes',
                'description' => 'Observation des insectes du jardin avec loupes et fiches explicatives.',
                'agemin' => 5, 'agemax' => 14, 'duration' => 60,
                'season' => 'Spring', 'location' => 'Parc municipal',
                'photourl' => '/assets/activities/insectes.jpg',
                'steps' => json_encode(['Observer', 'Identifier', 'Noter les découvertes']),
                'category' => 'Nature', 'difficulty' => 'Moyen',
                'credit_price' => 10, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🐰 Pâques & Créations
            [
                'title' => 'Peinture d’œufs de Pâques',
                'description' => 'Décoration d’œufs avec peinture, paillettes et autocollants.',
                'agemin' => 3, 'agemax' => 12, 'duration' => 40,
                'season' => 'Spring', 'location' => 'Salle d\'art',
                'photourl' => '/assets/activities/oeufs.jpg',
                'steps' => json_encode(['Préparer les œufs', 'Peindre', 'Décorer']),
                'category' => 'Pâques', 'difficulty' => 'Facile',
                'credit_price' => 6, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Chasse aux œufs',
                'description' => 'Parcours ludique avec indices pour retrouver les œufs cachés.',
                'agemin' => 4, 'agemax' => 14, 'duration' => 60,
                'season' => 'Spring', 'location' => 'Parc extérieur',
                'photourl' => '/assets/activities/chasse.jpg',
                'steps' => json_encode(['Lire les indices', 'Chercher', 'Valider']),
                'category' => 'Pâques', 'difficulty' => 'Moyen',
                'credit_price' => 5, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🎨 Arts & Couleurs
            [
                'title' => 'Peinture arc‑en‑ciel',
                'description' => 'Création d’un arc‑en‑ciel avec peinture et éponges.',
                'agemin' => 3, 'agemax' => 10, 'duration' => 30,
                'season' => 'All', 'location' => 'Salle d\'art',
                'photourl' => '/assets/activities/arcenciel.jpg',
                'steps' => json_encode(['Préparer les couleurs', 'Peindre', 'Sécher']),
                'category' => 'Art', 'difficulty' => 'Facile',
                'credit_price' => 7, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Atelier pâte à sel',
                'description' => 'Modelage créatif avec pâte à sel colorée.',
                'agemin' => 4, 'agemax' => 12, 'duration' => 50,
                'season' => 'All', 'location' => 'Maison',
                'photourl' => '/assets/activities/patesel.jpg',
                'steps' => json_encode(['Préparer la pâte', 'Modeler', 'Sécher']),
                'category' => 'Art', 'difficulty' => 'Moyen',
                'credit_price' => 6, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🪁 Plein air
            [
                'title' => 'Atelier cerf‑volant',
                'description' => 'Fabrication et décoration d’un cerf‑volant.',
                'agemin' => 6, 'agemax' => 15, 'duration' => 90,
                'season' => 'Summer', 'location' => 'Terrain de sport',
                'photourl' => '/assets/activities/cerfvolant.jpg',
                'steps' => json_encode(['Assembler', 'Décorer', 'Tester']),
                'category' => 'Plein air', 'difficulty' => 'Difficile',
                'credit_price' => 12, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🌻 Jardinage
            [
                'title' => 'Semis en pot',
                'description' => 'Apprendre à faire germer des graines en intérieur.',
                'agemin' => 4, 'agemax' => 12, 'duration' => 30,
                'season' => 'Spring', 'location' => 'Maison',
                'photourl' => '/assets/activities/semis.jpg',
                'steps' => json_encode(['Mettre la terre', 'Planter', 'Arroser']),
                'category' => 'Nature', 'difficulty' => 'Facile',
                'credit_price' => 5, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🎵 Musique
            [
                'title' => 'Initiation à la musique',
                'description' => 'Découverte des instruments et des rythmes.',
                'agemin' => 4, 'agemax' => 10, 'duration' => 45,
                'season' => 'Winter', 'location' => 'Salle de musique',
                'photourl' => '/assets/activities/musique.jpg',
                'steps' => json_encode(['Découvrir les sons', 'Essayer les instruments', 'Créer un rythme']),
                'category' => 'Musique', 'difficulty' => 'Facile',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🍳 Cuisine
            [
                'title' => 'Atelier cuisine enfants',
                'description' => 'Préparation de recettes simples et amusantes.',
                'agemin' => 6, 'agemax' => 14, 'duration' => 60,
                'season' => 'Autumn', 'location' => 'Cuisine pédagogique',
                'photourl' => '/assets/activities/cuisine.jpg',
                'steps' => json_encode(['Préparer', 'Mélanger', 'Cuire']),
                'category' => 'Cuisine', 'difficulty' => 'Moyen',
                'credit_price' => 10, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
        ];

        // ───────────────────────────────────────────────
        // ACTIVITÉS NON PUBLIÉES
        // ───────────────────────────────────────────────
        $unpublished = [
            [
                'title' => 'Sortie au parc',
                'description' => 'Jeux libres et activités plein air.',
                'agemin' => 3, 'agemax' => 10, 'duration' => 90,
                'season' => 'Spring', 'location' => 'Parc municipal',
                'photourl' => null,
                'steps' => json_encode(['Jeux libres', 'Course', 'Observation']),
                'category' => 'Plein air', 'difficulty' => 'Facile',
                'credit_price' => null, 'is_purchasable' => false, 'is_published' => false,
                'iduser' => $user1->iduser,
            ],
            [
                'title' => 'Lecture illustrée',
                'description' => 'Lecture animée pour les plus petits.',
                'agemin' => 2, 'agemax' => 6, 'duration' => 30,
                'season' => 'Winter', 'location' => 'Bibliothèque',
                'photourl' => null,
                'steps' => json_encode(['Choisir un livre', 'Lire', 'Discuter']),
                'category' => 'Lecture', 'difficulty' => 'Facile',
                'credit_price' => null, 'is_purchasable' => false, 'is_published' => false,
                'iduser' => $user1->iduser,
            ],
        ];

        // Fusion
        $activities = array_merge($published, $unpublished);

        // ───────────────────────────────────────────────
        // INSERTION + RELATIONS
        // ───────────────────────────────────────────────
        foreach ($activities as $data) {

            $activity = Activity::firstOrCreate(
                ['title' => $data['title'], 'iduser' => $data['iduser']],
                $data
            );

            if ($themes->count() > 0) {
                $selected = $themes->random(min(2, $themes->count()));
                $activity->themes()->syncWithoutDetaching(
                    collect($selected)->pluck('idtheme')->toArray()
                );
            }

            if ($competences->count() > 0) {
                $selected = $competences->random(min(2, $competences->count()));
                $activity->competences()->syncWithoutDetaching(
                    collect($selected)->pluck('idcompetence')->toArray()
                );
            }
        }
    }
}
