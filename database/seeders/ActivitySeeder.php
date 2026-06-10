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

            // 🔬 Sciences
            [
                'title' => 'Expérience volcanique',
                'description' => 'Créer un volcan en éruption avec du bicarbonate et du vinaigre.',
                'agemin' => 5, 'agemax' => 14, 'duration' => 40,
                'season' => 'All', 'location' => 'Maison',
                'photourl' => '/assets/activities/volcan.jpg',
                'steps' => json_encode(['Façonner le volcan', 'Mettre le bicarbonate', 'Verser le vinaigre', 'Observer l\'éruption']),
                'category' => 'Sciences', 'difficulty' => 'Facile',
                'credit_price' => 7, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Fabrication de slime',
                'description' => 'Créer sa propre slime colorée avec des ingrédients simples.',
                'agemin' => 6, 'agemax' => 14, 'duration' => 35,
                'season' => 'All', 'location' => 'Maison',
                'photourl' => '/assets/activities/slime.jpg',
                'steps' => json_encode(['Mélanger la colle et le colorant', 'Ajouter l\'activateur', 'Malaxer', 'Tester la texture']),
                'category' => 'Sciences', 'difficulty' => 'Facile',
                'credit_price' => 6, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Cristaux de sel magiques',
                'description' => 'Observer la formation de cristaux en faisant évaporer une solution saturée.',
                'agemin' => 7, 'agemax' => 14, 'duration' => 30,
                'season' => 'All', 'location' => 'Maison',
                'photourl' => '/assets/activities/cristaux.jpg',
                'steps' => json_encode(['Préparer la solution', 'Immerger un support', 'Attendre et observer', 'Récolter les cristaux']),
                'category' => 'Sciences', 'difficulty' => 'Moyen',
                'credit_price' => 9, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🎭 Théâtre & Expression
            [
                'title' => 'Atelier marionnettes',
                'description' => 'Fabriquer et animer des marionnettes à partir de chaussettes et matériaux recyclés.',
                'agemin' => 4, 'agemax' => 12, 'duration' => 75,
                'season' => 'Winter', 'location' => 'Salle polyvalente',
                'photourl' => '/assets/activities/marionnettes.jpg',
                'steps' => json_encode(['Fabriquer la marionnette', 'Lui inventer un nom', 'Écrire une courte histoire', 'Jouer la scène']),
                'category' => 'Théâtre', 'difficulty' => 'Moyen',
                'credit_price' => 11, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Mime et expression corporelle',
                'description' => 'Apprendre à communiquer sans paroles à travers le corps et les émotions.',
                'agemin' => 5, 'agemax' => 12, 'duration' => 45,
                'season' => 'All', 'location' => 'Salle polyvalente',
                'photourl' => '/assets/activities/mime.jpg',
                'steps' => json_encode(['Échauffement', 'Exercices de mimique', 'Saynètes en binôme', 'Présentation au groupe']),
                'category' => 'Théâtre', 'difficulty' => 'Facile',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 💃 Danse
            [
                'title' => 'Initiation à la danse africaine',
                'description' => 'Découverte des rythmes et mouvements de la danse africaine traditionnelle.',
                'agemin' => 5, 'agemax' => 14, 'duration' => 60,
                'season' => 'All', 'location' => 'Salle de danse',
                'photourl' => '/assets/activities/danse-africaine.jpg',
                'steps' => json_encode(['Échauffement', 'Apprentissage des rythmes de base', 'Enchaînement de pas', 'Improvisation libre']),
                'category' => 'Danse', 'difficulty' => 'Moyen',
                'credit_price' => 12, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Danse créative et libre',
                'description' => 'S\'exprimer librement par le mouvement sur différents styles musicaux.',
                'agemin' => 3, 'agemax' => 10, 'duration' => 40,
                'season' => 'All', 'location' => 'Salle de danse',
                'photourl' => '/assets/activities/danse-libre.jpg',
                'steps' => json_encode(['Écouter la musique', 'Bouger librement', 'Créer une chorégraphie', 'Partager avec les autres']),
                'category' => 'Danse', 'difficulty' => 'Facile',
                'credit_price' => 7, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // ♻️ Écologie & Recyclage
            [
                'title' => 'Création avec matériaux recyclés',
                'description' => 'Transformer des objets du quotidien en œuvres d\'art ou jouets.',
                'agemin' => 4, 'agemax' => 14, 'duration' => 60,
                'season' => 'All', 'location' => 'Atelier créatif',
                'photourl' => '/assets/activities/recyclage.jpg',
                'steps' => json_encode(['Trier les matériaux', 'Imaginer une création', 'Assembler et coller', 'Décorer']),
                'category' => 'Écologie', 'difficulty' => 'Facile',
                'credit_price' => 5, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Compostage pour enfants',
                'description' => 'Comprendre le compostage et fabriquer un mini-composteur.',
                'agemin' => 6, 'agemax' => 14, 'duration' => 50,
                'season' => 'Spring', 'location' => 'Jardin pédagogique',
                'photourl' => '/assets/activities/compost.jpg',
                'steps' => json_encode(['Comprendre le cycle naturel', 'Séparer les déchets organiques', 'Remplir le composteur', 'Observer la transformation']),
                'category' => 'Écologie', 'difficulty' => 'Moyen',
                'credit_price' => 9, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🧘 Bien-être & Relaxation
            [
                'title' => 'Yoga pour enfants',
                'description' => 'Initiation au yoga avec postures adaptées, respiration et relaxation.',
                'agemin' => 4, 'agemax' => 12, 'duration' => 45,
                'season' => 'All', 'location' => 'Salle calme',
                'photourl' => '/assets/activities/yoga.jpg',
                'steps' => json_encode(['Respiration consciente', 'Postures animales', 'Équilibre', 'Relaxation finale']),
                'category' => 'Bien-être', 'difficulty' => 'Facile',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Méditation guidée pour petits',
                'description' => 'Séance de pleine conscience et visualisation créatrice pour enfants.',
                'agemin' => 5, 'agemax' => 12, 'duration' => 25,
                'season' => 'All', 'location' => 'Salle calme',
                'photourl' => '/assets/activities/meditation.jpg',
                'steps' => json_encode(['S\'installer confortablement', 'Respirer lentement', 'Écouter la visualisation', 'Partager ses ressentis']),
                'category' => 'Bien-être', 'difficulty' => 'Facile',
                'credit_price' => 6, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 🔨 Bricolage
            [
                'title' => 'Construction en bois',
                'description' => 'Assembler une petite maquette en bois avec outils adaptés aux enfants.',
                'agemin' => 7, 'agemax' => 14, 'duration' => 90,
                'season' => 'Winter', 'location' => 'Atelier bricolage',
                'photourl' => '/assets/activities/bois.jpg',
                'steps' => json_encode(['Choisir le modèle', 'Découper les pièces', 'Assembler', 'Peindre et décorer']),
                'category' => 'Bricolage', 'difficulty' => 'Difficile',
                'credit_price' => 15, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Mobile en papier',
                'description' => 'Créer un mobile décoratif avec origami et fil.',
                'agemin' => 5, 'agemax' => 12, 'duration' => 55,
                'season' => 'All', 'location' => 'Maison',
                'photourl' => '/assets/activities/mobile.jpg',
                'steps' => json_encode(['Plier les formes en origami', 'Colorier', 'Accrocher sur le fil', 'Équilibrer le mobile']),
                'category' => 'Bricolage', 'difficulty' => 'Moyen',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // ⚽ Sport
            [
                'title' => 'Initiation au jonglage',
                'description' => 'Apprendre les bases du jonglage avec balles et foulards.',
                'agemin' => 6, 'agemax' => 14, 'duration' => 50,
                'season' => 'All', 'location' => 'Gymnase',
                'photourl' => '/assets/activities/jonglage.jpg',
                'steps' => json_encode(['Exercice foulard', 'Jonglage à 1 balle', 'Jonglage à 2 balles', 'Enchaînement']),
                'category' => 'Sport', 'difficulty' => 'Difficile',
                'credit_price' => 10, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Parcours d\'obstacles',
                'description' => 'Parcours moteur ludique avec franchissement d\'obstacles variés.',
                'agemin' => 3, 'agemax' => 10, 'duration' => 40,
                'season' => 'Summer', 'location' => 'Gymnase',
                'photourl' => '/assets/activities/obstacles.jpg',
                'steps' => json_encode(['Échauffement', 'Présentation du parcours', 'Essai individuel', 'Course chronométrée']),
                'category' => 'Sport', 'difficulty' => 'Moyen',
                'credit_price' => 7, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],

            // 📚 Lecture & Écriture
            [
                'title' => 'Atelier contes inventés',
                'description' => 'Imaginer et raconter une histoire originale avec des personnages choisis.',
                'agemin' => 5, 'agemax' => 12, 'duration' => 50,
                'season' => 'Winter', 'location' => 'Bibliothèque',
                'photourl' => '/assets/activities/contes.jpg',
                'steps' => json_encode(['Choisir les personnages', 'Inventer une situation', 'Construire l\'histoire', 'Raconter au groupe']),
                'category' => 'Lecture', 'difficulty' => 'Moyen',
                'credit_price' => 9, 'is_purchasable' => true, 'is_published' => true,
                'iduser' => $admin->iduser,
            ],
            [
                'title' => 'Calligraphie créative',
                'description' => 'Découverte de la calligraphie et création de son prénom stylisé.',
                'agemin' => 7, 'agemax' => 14, 'duration' => 45,
                'season' => 'All', 'location' => 'Salle d\'art',
                'photourl' => '/assets/activities/calligraphie.jpg',
                'steps' => json_encode(['Découvrir les outils', 'S\'exercer sur des lettres', 'Écrire son prénom', 'Décorer la feuille']),
                'category' => 'Art', 'difficulty' => 'Moyen',
                'credit_price' => 8, 'is_purchasable' => true, 'is_published' => true,
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
