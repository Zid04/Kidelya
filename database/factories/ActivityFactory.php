<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Activity.
 * Génère des activités avec des données réalistes.
 */
class ActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Title'             => $this->faker->sentence(3),
            'Description'       => $this->faker->paragraph(),
            'AgeMin'            => $ageMin = $this->faker->numberBetween(3, 10),
            'AgeMax'            => $this->faker->numberBetween($ageMin, 18),
            'Duration'          => $this->faker->randomElement([30, 45, 60, 90, 120]),
            'Season'            => $this->faker->randomElement(['Spring', 'Summer', 'Autumn', 'Winter']),
            'Location'          => $this->faker->city(),
            'PhotoUrl'          => $this->faker->imageUrl(640, 480, 'nature'),
            'IdUser'            => User::factory(),
        ];
    }
}