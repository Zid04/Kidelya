<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Planning;

class PlanningPolicy
{
    /**
     * Voir la liste des plannings
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un planning — uniquement propriétaire
     */
    public function view(User $user, Planning $planning): bool
    {
        return $user->iduser === $planning->iduser;
    }

    /**
     * Créer un planning
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modifier un planning — uniquement propriétaire
     */
    public function update(User $user, Planning $planning): bool
    {
        return $user->iduser === $planning->iduser;
    }

    /**
     * Supprimer un planning — uniquement propriétaire
     */
    public function delete(User $user, Planning $planning): bool
    {
        return $user->iduser === $planning->iduser;
    }
}
