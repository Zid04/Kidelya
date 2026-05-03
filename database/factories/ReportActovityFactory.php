<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle ReportActivity.
 * Génère des rapports d'activités avec des données réalistes.
 */
class ReportActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Comments'     => $this->faker->optional()->paragraph(),
            'PhotoUrl'     => $this->faker->optional()->imageUrl(640, 480),
            'Improvements' => $this->faker->optional()->sentence(),
            'Positive'     => $this->faker->optional()->sentence(),
            'Difficulties' => $this->faker->optional()->sentence(),
        ];
    }
}