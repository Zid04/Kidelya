<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
            'name' => $this->faker->unique()->randomElement($themes),
        ];
    }
}
