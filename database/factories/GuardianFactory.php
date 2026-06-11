<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GuardianFactory extends Factory
{
    public function definition(): array
    {
        return [
            'names'   => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'email'   => $this->faker->unique()->safeEmail(),
            'phone'   => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
        ];
    }
}
