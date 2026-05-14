<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Competence;

class CompetencePolicy
{
    /**
     * Voir toutes les compétences
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir une compétence
     */
    public function view(User $user, Competence $competence): bool
    {
        return true;
    }

    /**
     * Créer une compétence
     */
    public function create(User $user): bool
    {
        return true; // à affiner selon rôle si besoin
    }

    /**
     * Modifier une compétence
     */
    public function update(User $user, Competence $competence): bool
    {
        return true; // à affiner selon rôle si besoin
    }

    /**
     * Supprimer une compétence
     */
    public function delete(User $user, Competence $competence): bool
    {
        return true; // à affiner selon rôle si besoin
    }
}
