<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Child;

class ChildPolicy
{
    /**
     * Voir la liste des enfants
     * uniquement le propriétaire
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un enfant
     *  uniquement le propriétaire 
     */
    public function view(User $user, Child $child): bool
    {
        return $user->IdUser === $child->IdUser;
    }

    /**
     * Création d’un enfant  (tout utilisateur connecté)
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modification (seulement propriétaire)
     */
    public function update(User $user, Child $child): bool
    {
        return $user->IdUser === $child->IdUser;
    }

    /**
     * Suppression (seulement propriétaire)
     */
    public function delete(User $user, Child $child): bool
    {
        return $user->IdUser === $child->IdUser;
    }
}