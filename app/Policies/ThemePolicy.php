<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Theme;

class ThemePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Theme $theme): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Theme $theme): bool
    {
        return true; 
    }

    public function delete(User $user, Theme $theme): bool
    {
        return true; 
    }
}
