<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Seeder;

/**
 * Seeder pour les thèmes.
 *
 * Crée les thèmes de base utilisés pour catégoriser les activités.
 * Données de référence — indépendant des autres seeders.
 */
class ThemeSeeder extends Seeder
{
    public function run(): void
    {
        $themes = [
            'Nature',
            'Sport',
            'Art',
            'Musique',
            'Science',
            'Cuisine',
            'Voyage',
            'Technologie',
            'Lecture',
            'Cinéma',
            'Théâtre',
            'Danse',
        ];

        foreach ($themes as $theme) {
            Theme::firstOrCreate(['Name' => $theme]);
        }
    }
}