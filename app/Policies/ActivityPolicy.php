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
        return true;
    }

    public function create(User $user): bool
    {
        return true; // tu peux restreindre aux rôles si besoin
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
