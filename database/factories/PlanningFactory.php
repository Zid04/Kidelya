<?php

namespace Database\Factories;

use App\Models\ReportActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanningFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'       => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'location'    => $this->faker->city(),
            'iduser'      => User::factory(),
            'idreport'    => ReportActivity::factory(),
        ];
    }
}
