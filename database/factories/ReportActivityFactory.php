<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReportActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'comments'     => $this->faker->optional()->paragraph(),
            'photourl'     => $this->faker->optional()->imageUrl(640, 480),
            'improvements' => $this->faker->optional()->sentence(),
            'positive'     => $this->faker->optional()->sentence(),
            'difficulties' => $this->faker->optional()->sentence(),
        ];
    }
}
