<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Theme;

class ThemePolicy
{
    public function viewAny(User $user): bool
    {
        return auth()->check();
    }

    public function view(User $user, Theme $theme): bool
    {
        return auth()->check();
    }

    public function create(User $user): bool
    {
        return auth()->check();
    }

    public function update(User $user, Theme $theme): bool
    {
        return $user->IdUser === $group->IdUser;
    }

    public function delete(User $user, Theme $theme): bool
    {
        return $user->IdUser === $group->IdUser;
    }
}