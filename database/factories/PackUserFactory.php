<?php

namespace Database\Factories;

use App\Models\Pack;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackUserFactory extends Factory
{
    public function definition(): array
    {
        $subscriptionDate = $this->faker->dateTimeBetween('-1 year', 'now');

        return [
            'idpack'           => Pack::factory(),
            'iduser'           => User::factory(),
            'subscriptiondate' => $subscriptionDate->format('Y-m-d'),
            'expirationdate'   => $this->faker->dateTimeBetween($subscriptionDate, '+1 year')->format('Y-m-d'),
            'status'           => $this->faker->randomElement(['active', 'inactive', 'canceled']),
        ];
    }

    /**
     * Souscription active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }
}
