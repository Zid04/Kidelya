<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory pour le modèle User.
 * Génère des utilisateurs avec des données réalistes.
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'FirstName'          => $this->faker->firstName(),
            'LastName'           => $this->faker->lastName(),
            'Email'              => $this->faker->unique()->safeEmail(),
            'email_verified_at'  => now(),
            'Password'           => Hash::make('password'), // mot de passe par défaut
            'AvatarUrl'          => $this->faker->imageUrl(200, 200, 'people'),
            'is_active'          => true,
            'IdRole'             => Role::factory(),
        ];
    }

    /**
     * Utilisateur non vérifié.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Utilisateur désactivé.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}