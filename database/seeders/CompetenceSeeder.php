<?php

namespace Database\Seeders;

use App\Models\Competence;
use Illuminate\Database\Seeder;

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
            Competence::firstOrCreate(['name' => $competence]);
        }
    }
}
