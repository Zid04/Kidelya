<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Idea;

/**
 * Policy Idea
 *
 * Règle métier :
 * une idée appartient à un user
 *seul le propriétaire peut la gérer
 */
class IdeaPolicy
{
    // ─── Permissions ─────────────────────────────────────────
    // Seul le propriétaire de l'idée peut la voir, la modifier ou la supprimer.
    public function viewAny(User $user): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }
// Seul les utilisateurs authentifiés peuvent créer des idées.
    public function view(User $user, Idea $idea): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }

    public function create(User $user): bool
    {
        return auth()->check();
    }

    public function update(User $user, Idea $idea): bool
    {
        return auth()->check() && $user->IdUser === $group->IdUser;
    }

    public function delete(User $user, Idea $idea): bool
    {
         return auth()->check() && $user->IdUser === $group->IdUser;
    }
}