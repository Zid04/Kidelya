<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Guardian;

/**
 * Sécurité Guardian (parents/tuteurs)
 */
class GuardianPolicy
{
    // ─── Permissions ─────────────────────────────────────────
    // Seul le propriétaire du groupe peut voir, modifier ou supprimer les tuteurs associés .
    public function viewAny(User $user): bool
    {
          return auth()->check() && $user->IdUser === $group->IdUser;
    }

    public function view(User $user, Guardian $guardian): bool
    {
          return auth()->check() && $user->IdUser === $group->IdUser;
    }

    public function create(User $user): bool
    {
        return auth()->check();
    }

    public function update(User $user, Guardian $guardian): bool
    {
          return auth()->check() && $user->IdUser === $group->IdUser;
    }

    public function delete(User $user, Guardian $guardian): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }
}