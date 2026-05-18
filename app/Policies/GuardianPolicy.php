<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Guardian;

class GuardianPolicy
{
    /**
     * Voir la liste des tuteurs
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un tuteur — uniquement propriétaire
     */
    public function view(User $user, Guardian $guardian): bool
    {
        return $user->iduser === $guardian->iduser;
    }

    /**
     * Créer un tuteur
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modifier un tuteur — uniquement propriétaire
     */
    public function update(User $user, Guardian $guardian): bool
    {
        return $user->iduser === $guardian->iduser;
    }

    /**
     * Supprimer un tuteur — uniquement propriétaire
     */
    public function delete(User $user, Guardian $guardian): bool
    {
        return $user->iduser === $guardian->iduser;
    }
}
