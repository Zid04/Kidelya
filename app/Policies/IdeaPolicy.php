<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Idea;

class IdeaPolicy
{
    /**
     * Voir la liste des idées
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir une idée — uniquement propriétaire
     */
    public function view(User $user, Idea $idea): bool
    {
        return $user->iduser === $idea->iduser;
    }

    /**
     * Créer une idée
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modifier une idée — uniquement propriétaire
     */
    public function update(User $user, Idea $idea): bool
    {
        return $user->iduser === $idea->iduser;
    }

    /**
     * Supprimer une idée — uniquement propriétaire
     */
    public function delete(User $user, Idea $idea): bool
    {
        return $user->iduser === $idea->iduser;
    }
}
