<?php

namespace Database\Factories;

use App\Models\ReportActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Planning.
 * Génère des plannings avec des données réalistes.
 */
class PlanningFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Title'       => $this->faker->sentence(3),
            'Description' => $this->faker->optional()->paragraph(),
            'Location'    => $this->faker->city(),
            'IdUser'      => User::factory(),
            'IdReport'    => ReportActivity::factory(),
        ];
    }
}