<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Pack;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('role', fn ($q) => $q->where('type', 'Admin'))->first();

        if (! $admin) {
            $this->command->warn('PackSeeder skipped: no admin found.');

            return;
        }

        $activities = Activity::where('is_published', true)->get();
        $packsTableHasIllustration = Schema::hasColumn('packs', 'illustration');
        $activitiesTableHasCategory = Schema::hasColumn('activities', 'category');

        $packs = [
            [
                'title' => 'Pack Découverte',
                'description' => 'Idéal pour débuter avec des activités variées et simples à organiser.',
                'tarification' => 7.90,
                'duration' => 30,
                'type' => 'monthly',
                'is_published' => true,
                'createdby' => $admin->iduser,
                'illustration' => null,
            ],
            [
                'title' => 'Pack Premium',
                'description' => 'Un pack complet pour profiter de nombreuses activités pendant trois mois.',
                'tarification' => 7.90,
                'duration' => 90,
                'type' => 'quarterly',
                'is_published' => true,
                'createdby' => $admin->iduser,
                'illustration' => null,
            ],
            [
                'title' => 'Pack Annuel',
                'description' => 'Le meilleur rapport qualité/prix pour une année complète d\'activités.',
                'tarification' => 7.90,
                'duration' => 365,
                'type' => 'yearly',
                'is_published' => true,
                'createdby' => $admin->iduser,
                'illustration' => null,
            ],
            [
                'title' => 'Nature & Printemps',
                'description' => 'Des activités pour découvrir la nature, les plantes et les petits changements du printemps.',
                'tarification' => 7.90,
                'duration' => 7,
                'illustration' => 'https://emeu-kidstore.com/img/cms/Articles%20guides%20et%20conseils/shutterstock_1384179008.jpg',
                'is_published' => true,
                'type' => 'seasonal',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Pâques & Créations',
                'description' => 'Des idées créatives autour de Pâques : peinture, chasse aux œufs et bricolages.',
                'tarification' => 7.90,
                'duration' => 5,
                'illustration' => 'https://www.happykits.fr/cdn-cgi/image/width=900,height=900,format=auto/https://www.happykits.fr/00DATA/cms/blog/jeux-paques-famille/jeux-paques-pompon.jpg',
                'is_published' => true,
                'type' => 'event',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Jardinage & Découverte',
                'description' => 'Apprendre à planter, arroser et observer la nature au fil des jours.',
                'tarification' => 7.90,
                'duration' => 10,
                'illustration' => 'https://www.pretajardiner.com/modules/ph_simpleblog/covers/136.jpg',
                'is_published' => true,
                'type' => 'nature',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Arts & Couleurs',
                'description' => 'Des ateliers artistiques pour développer la créativité et jouer avec les couleurs.',
                'tarification' => 7.90,
                'duration' => 6,
                'illustration' => 'https://i0.wp.com/blog.artsper.com/wp-content/uploads/2018/12/Artboard.jpg?fit=644%2C644&ssl=1',
                'is_published' => true,
                'type' => 'art',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Jeux & Plein air',
                'description' => 'Des activités en extérieur pour bouger, coopérer et s\'amuser.',
                'tarification' => 7.90,
                'duration' => 8,
                'illustration' => 'https://images.ctfassets.net/b85ozb2q358o/96b1d14239f2bd1c2d56f930cf31471bda9813b3a0a08fefba116f0d0a0792dd/80eaafcddaabbe909293e627724461c9/image.png',
                'is_published' => true,
                'type' => 'outdoor',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Cuisine des Petits',
                'description' => 'Recettes simples, découvertes sensorielles et petits défis gourmands.',
                'tarification' => 7.90,
                'duration' => 7,
                'illustration' => null,
                'is_published' => true,
                'type' => 'cooking',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Motricité & Éveil',
                'description' => 'Parcours, jeux de coordination et activités pour développer la motricité.',
                'tarification' => 7.90,
                'duration' => 6,
                'illustration' => null,
                'is_published' => true,
                'type' => 'motor-skills',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Sciences Faciles',
                'description' => 'Petites expériences amusantes pour comprendre le monde avec des objets du quotidien.',
                'tarification' => 7.90,
                'duration' => 8,
                'illustration' => null,
                'is_published' => true,
                'type' => 'science',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Histoires & Imaginaire',
                'description' => 'Activités autour des contes, de l\'expression orale et de l\'imagination.',
                'tarification' => 7.90,
                'duration' => 5,
                'illustration' => null,
                'is_published' => true,
                'type' => 'story',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Musique & Rythmes',
                'description' => 'Jeux sonores, percussions maison et activités pour explorer le rythme.',
                'tarification' => 7.90,
                'duration' => 5,
                'illustration' => null,
                'is_published' => true,
                'type' => 'music',
                'createdby' => $admin->iduser,
            ],
            [
                'title' => 'Vacances Créatives',
                'description' => 'Un programme facile à suivre pour occuper les enfants pendant les vacances.',
                'tarification' => 7.90,
                'duration' => 14,
                'illustration' => null,
                'is_published' => true,
                'type' => 'holiday',
                'createdby' => $admin->iduser,
            ],
        ];

        foreach ($packs as $data) {
            if (! $packsTableHasIllustration) {
                unset($data['illustration']);
            }

            $pack = Pack::updateOrCreate(
                ['title' => $data['title'], 'createdby' => $data['createdby']],
                $data
            );

            $activitiesToAttach = collect();

            if ($activitiesTableHasCategory) {
                $activitiesToAttach = match ($pack->title) {
                    'Nature & Printemps', 'Jardinage & Découverte' => Activity::where('category', 'Nature')->where('is_published', true)->pluck('idactivities'),

                    'Pâques & Créations' => Activity::where('category', 'Pâques')->where('is_published', true)->pluck('idactivities'),

                    'Arts & Couleurs' => Activity::where('category', 'Art')->where('is_published', true)->pluck('idactivities'),

                    'Jeux & Plein air' => Activity::where('category', 'Plein air')->where('is_published', true)->pluck('idactivities'),

                    default => collect(),
                };
            }

            if ($activitiesToAttach->count() === 0 && $activities->count() > 0) {
                $activitiesToAttach = $activities
                    ->random(min(3, $activities->count()))
                    ->pluck('idactivities');
            }

            if ($activitiesToAttach->count() > 0) {
                $pack->activities()->syncWithoutDetaching($activitiesToAttach->toArray());
            }
        }
    }
}
