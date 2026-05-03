<?php

namespace Database\Factories;

use App\Models\Pack;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle PackUser.
 * Génère des souscriptions aux packs avec des données réalistes.
 */
class PackUserFactory extends Factory
{
    public function definition(): array
    {
        $subscriptionDate = $this->faker->dateTimeBetween('-1 year', 'now');

        return [
            'IdPack'           => Pack::factory(),
            'IdUser'           => User::factory(),
            'SubscriptionDate' => $subscriptionDate->format('Y-m-d'),
            'ExpirationDate'   => $this->faker->dateTimeBetween($subscriptionDate, '+1 year')->format('Y-m-d'),
            'Status'           => $this->faker->randomElement(['active', 'inactive', 'canceled']),
        ];
    }

    /**
     * Souscription active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'Status' => 'active',
        ]);
    }
}