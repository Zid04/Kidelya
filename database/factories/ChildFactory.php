<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Child.
 * Génère des enfants avec des données réalistes.
 */
class ChildFactory extends Factory
{
    public function definition(): array
    {
        return [
            'LastName'          => $this->faker->lastName(),
            'FirstName'         => $this->faker->firstName(),
            'BirthDay'          => $this->faker->dateTimeBetween('-15 years', '-3 years')->format('Y-m-d'),
            'SpecificationNote' => $this->faker->optional()->sentence(),
            'Sexe'              => $this->faker->randomElement(['Male', 'Female', 'Other']),
            'PhotoUrl'          => $this->faker->optional()->imageUrl(200, 200, 'people'),
            'IdUser'            => User::factory(),
        ];
    }
}