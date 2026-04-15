<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Group;

/**
 * Policy Group
 *
 * Règle métier :
 * seul le user créateur du groupe peut le gérer
 */
class GroupPolicy
{
    /**
     * Liste des groupes
     */
    public function viewAny(User $user): bool
    {
    
        return auth()->check() && $user->IdUser === $group->IdUser;
    }

    /**
     * Voir un groupe
     * uniquement propriétaire 
     */
    public function view(User $user, Group $group): bool
    {
            return auth()->check() && $user->IdUser === $group->IdUser;
       
    }

    /**
     * Créer un groupe
     */
    public function create(User $user): bool
    {
        return auth()->check();
    }

    /**
     * Modifier un groupe
     * uniquement propriétaire
     */
    public function update(User $user, Group $group): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }

    /**
     * Supprimer un groupe
     * uniquement propriétaire
     */
    public function delete(User $user, Group $group): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }
//ajouter un enfant à un groupe
    public function attachChild(User $user, Group $group): bool
    {
        return auth()->check() && $user->IdUser === $group->IdUser;
    }
    // retirer un enfant d'un groupe
    public function detachChild(User $user, Group $group): bool
    {
        return auth()->check() && $user->IdUser === $group->IdUser;
    }
}