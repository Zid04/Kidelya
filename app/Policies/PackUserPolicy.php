<?php

namespace App\Policies;

use App\Models\PackUser;
use App\Models\User;

class PackUserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role?->type === 'Admin';
    }

    public function view(User $user, PackUser $subscription): bool
    {
        return $user->role?->type === 'Admin'
            || $user->iduser === $subscription->iduser;
    }

    public function create(User $user): bool
    {
        return $user->role?->type === 'Admin';
    }

    public function update(User $user, PackUser $subscription): bool
    {
        return $user->role?->type === 'Admin';
    }

    public function delete(User $user, PackUser $subscription): bool
    {
        return $user->role?->type === 'Admin';
    }
}
