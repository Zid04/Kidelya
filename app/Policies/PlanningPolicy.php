<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Planning;

class PlanningPolicy
{
    // Les méthodes d'autorisation pour les actions sur les plannings
    // Chaque méthode retourne un booléen indiquant si l'utilisateur est autorisé à effectuer l'action
    public function viewAny(User $user): bool
    {
        return auth()->check() && $user->IdUser === $planning->IdUser;
    }
//permet de vérifier si l'utilisateur connecté est le propriétaire du planning pour autoriser la visualisation, la création, la mise à jour et la suppression du planning.
    public function view(User $user, Planning $planning): bool
    {
        return auth()->check() && $user->IdUser === $planning->IdUser;
    }

    public function create(User $user): bool
    {
        return auth()->check();
    }

    public function update(User $user, Planning $planning): bool
    {
        return auth()->check() && $user->IdUser === $planning->IdUser;
    }

    public function delete(User $user, Planning $planning): bool
    {
        return auth()->check() && $user->IdUser === $planning->IdUser;
    }
}