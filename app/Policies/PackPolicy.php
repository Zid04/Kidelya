<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Pack;

class PackPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Pack $pack): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; 
    }

    public function update(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }

    public function delete(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }

    public function publish(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }

    public function unpublish(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }

    
    public function attachActivity(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }

    public function detachActivity(User $user, Pack $pack): bool
    {
        return $user->iduser === $pack->createdby
            || $user->role->type === 'Admin';
    }
}
