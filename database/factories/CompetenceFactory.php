<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CompetenceFactory extends Factory
{
    public function definition(): array
    {
        $competences = [
            'Créativité', 'Travail en équipe', 'Autonomie',
            'Communication', 'Concentration', 'Motricité fine',
            'Motricité globale', 'Logique', 'Mémoire', 'Expression orale'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($competences),
        ];
    }
}
