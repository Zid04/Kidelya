<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Child;

class ChildPolicy
{
    /**
     * Voir la liste des enfants
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un enfant — uniquement le propriétaire
     */
    public function view(User $user, Child $child): bool
    {
        return $user->iduser === $child->iduser;
    }

    /**
     * Création d’un enfant
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modification — uniquement propriétaire
     */
    public function update(User $user, Child $child): bool
    {
        return $user->iduser === $child->iduser;
    }

    /**
     * Suppression — uniquement propriétaire
     */
    public function delete(User $user, Child $child): bool
    {
        return $user->iduser === $child->iduser;
    }
}
