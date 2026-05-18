<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class IdeaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'  => $this->faker->sentence(4),
            'notes'  => $this->faker->optional()->paragraph(),
            'iduser' => User::factory(),
        ];
    }
}
