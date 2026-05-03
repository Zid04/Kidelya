<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Idea.
 * Génère des idées d'activités avec des données réalistes.
 */
class IdeaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Title'  => $this->faker->sentence(4),
            'Notes'  => $this->faker->optional()->paragraph(),
            'IdUser' => User::factory(),
        ];
    }
}