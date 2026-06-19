<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChildFactory extends Factory
{
    public function definition(): array
    {
        return [
            'lastname' => $this->faker->lastName(),
            'firstname' => $this->faker->firstName(),
            'birthday' => $this->faker->dateTimeBetween('-15 years', '-3 years')->format('Y-m-d'),
            'specification_note' => $this->faker->optional()->sentence(),
            'sexe' => $this->faker->randomElement(['male', 'female']),
            'photourl' => $this->faker->optional()->imageUrl(200, 200, 'people'),
            'iduser' => User::factory(),
        ];
    }
}
