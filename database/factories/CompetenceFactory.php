<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour le modèle Competence.
 * Génère des compétences avec des noms réalistes.
 */
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
            'Name' => $this->faker->unique()->randomElement($competences),
        ];
    }
}