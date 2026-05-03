<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Role.
 * Génère des rôles avec un type aléatoire parmi les valeurs de l'enum.
 */
class RoleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Type' => $this->faker->randomElement(['Admin', 'User', 'Partner']),
        ];
    }
}