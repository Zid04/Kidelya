<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Pack.
 * Génère des packs d'activités avec des données réalistes.
 */
class PackFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Title'         => $this->faker->sentence(3),
            'Description'   => $this->faker->paragraph(),
            'Tarification'  => $this->faker->randomFloat(2, 9.99, 199.99),
            'Duration'      => $this->faker->randomElement([30, 60, 90, 180, 365]),
            'CreatedBy'     => User::factory(),
        ];
    }
}