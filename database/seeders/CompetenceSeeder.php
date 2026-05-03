<?php

namespace Database\Seeders;

use App\Models\Competence;
use Illuminate\Database\Seeder;

/**
 * Seeder pour les compétences.
 *
 * Crée les compétences de base associables aux activités.
 * Données de référence — indépendant des autres seeders.
 */
class CompetenceSeeder extends Seeder
{
    public function run(): void
    {
        $competences = [
            'Créativité',
            'Travail en équipe',
            'Autonomie',
            'Communication',
            'Concentration',
            'Motricité fine',
            'Motricité globale',
            'Logique',
            'Mémoire',
            'Expression orale',
        ];

        foreach ($competences as $competence) {
            Competence::firstOrCreate(['Name' => $competence]);
        }
    }
}