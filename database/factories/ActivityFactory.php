<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'       => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'agemin'      => $ageMin = $this->faker->numberBetween(3, 10),
            'agemax'      => $this->faker->numberBetween($ageMin, 18),
            'duration'    => $this->faker->randomElement([30, 45, 60, 90, 120]),
            'season'      => $this->faker->randomElement(['Spring', 'Summer', 'Autumn', 'Winter']),
            'location'    => $this->faker->city(),
            'photourl'    => $this->faker->imageUrl(640, 480, 'nature'),
            'iduser'      => User::factory(),
        ];
    }
}
