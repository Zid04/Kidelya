<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Guardian;

/**
 * Policy Guardian
 * Règle métier :
 * seul le user créateur du parent peut le gérer
 */
class GuardianPolicy
{
    /**
     * Liste
     */
    public function viewAny(User $user): bool
    {
        return auth()->check();
    }

    /**
     * Voir un parent
     *  uniquement propriétaire
     */
    public function view(User $user, Guardian $guardian): bool
    {
        return $user->IdUser === $guardian->IdUser;
    }

    /**
     * Créer un parent
     */
    public function create(User $user): bool
    {
        return auth()->check();
    }

    /**
     * Modifier parent
     * uniquement propriétaire
     */
    public function update(User $user, Guardian $guardian): bool
    {
        return $user->IdUser === $guardian->IdUser;
    }

    /**
     * Supprimer parent
     * uniquement propriétaire
     */
    public function delete(User $user, Guardian $guardian): bool
    {
        return $user->IdUser === $guardian->IdUser;
    }
}