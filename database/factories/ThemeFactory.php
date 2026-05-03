<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Theme.
 * Génère des thèmes avec des noms réalistes liés aux activités.
 */
class ThemeFactory extends Factory
{
    public function definition(): array
    {
        $themes = [
            'Nature', 'Sport', 'Art', 'Musique',
            'Science', 'Cuisine', 'Voyage', 'Technologie',
            'Lecture', 'Cinéma', 'Théâtre', 'Danse'
        ];

        return [
            'Name' => $this->faker->unique()->randomElement($themes),
        ];
    }
}