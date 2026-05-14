<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'        => $this->faker->sentence(3),
            'description'  => $this->faker->paragraph(),
            'tarification' => $this->faker->randomFloat(2, 9.99, 199.99),
            'duration'     => $this->faker->randomElement([30, 60, 90, 180, 365]),
            'createdby'    => User::factory(),
        ];
    }
}
