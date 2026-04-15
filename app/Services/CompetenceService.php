<?php

namespace App\Services;

use App\Models\Competence;

/**
 * Logique métier des compétences
 */
class CompetenceService
{
    /**
     * Liste toutes les compétences
     */
    public function getAll()
    {
        return Competence::with('activities')->latest()->get();
    }

    /**
     * Créer une compétence
     */
    public function create(array $data): Competence
    {
        return Competence::create($data);
    }

    /**
     * Modifier une compétence
     */
    public function update(Competence $competence, array $data): Competence
    {
        $competence->update($data);

        return $competence->fresh();
    }

    /**
     * Supprimer une compétence
     */
    public function delete(Competence $competence): void
    {
        $competence->delete();
    }
}