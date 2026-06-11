<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Activity $activity): bool
    {
        // Activités publiées : accessibles à tous les utilisateurs connectés
        // Activités non publiées : créateur et admins uniquement
        return $activity->is_published
            || $user->iduser === $activity->iduser
            || ($user->role && $user->role->type === 'Admin');
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Activity $activity): bool
    {
        return $user->iduser === $activity->iduser
            || $user->role->type === 'Admin';
    }

    public function delete(User $user, Activity $activity): bool
    {
        return $user->iduser === $activity->iduser
            || $user->role->type === 'Admin';
    }

    public function publish(User $user, Activity $activity): bool
    {
        return $user->iduser === $activity->iduser
            || $user->role->type === 'Admin';
    }

    public function unpublish(User $user, Activity $activity): bool
    {
        return $user->iduser === $activity->iduser
            || $user->role->type === 'Admin';
    }
}
