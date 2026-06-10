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

    public function view(User $user, Guardian $guardian): bool
    {
        return true;
    }

    /**
     * Créer un tuteur
     */
    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Guardian $guardian): bool
    {
        return true;
    }

    public function delete(User $user, Guardian $guardian): bool
    {
        return true;
    }
}
