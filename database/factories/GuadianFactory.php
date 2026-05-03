<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Guardian.
 * Génère des parents / tuteurs avec des données réalistes.
 */
class GuardianFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Names'   => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'Email'   => $this->faker->unique()->safeEmail(),
            'Phone'   => $this->faker->phoneNumber(),
            'Address' => $this->faker->address(),
        ];
    }
}