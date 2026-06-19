<?php

namespace App\Policies;

use App\Models\Guardian;
use App\Models\User;

class GuardianPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Guardian $guardian): bool
    {
        return $guardian->user_id === $user->iduser;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Guardian $guardian): bool
    {
        return $guardian->user_id === $user->iduser;
    }

    public function delete(User $user, Guardian $guardian): bool
    {
        return $guardian->user_id === $user->iduser;
    }
}
