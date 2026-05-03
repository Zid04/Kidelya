<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Group.
 * Génère des groupes avec des données réalistes.
 */
class GroupFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Name'        => $this->faker->words(2, true),
            'Description' => $this->faker->optional()->paragraph(),
            'IdUser'      => User::factory(),
        ];
    }
}