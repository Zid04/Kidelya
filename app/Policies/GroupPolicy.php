<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Group;

class GroupPolicy
{
    /**
     * Voir la liste des groupes
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un groupe — uniquement propriétaire
     */
    public function view(User $user, Group $group): bool
    {
        return $user->iduser === $group->iduser;
    }

    /**
     * Créer un groupe
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modifier un groupe — uniquement propriétaire
     */
    public function update(User $user, Group $group): bool
    {
        return $user->iduser === $group->iduser;
    }

    /**
     * Supprimer un groupe — uniquement propriétaire
     */
    public function delete(User $user, Group $group): bool
    {
        return $user->iduser === $group->iduser;
    }

    /**
     * Ajouter un enfant au groupe — uniquement propriétaire
     */
    public function attachChild(User $user, Group $group): bool
    {
        return $user->iduser === $group->iduser;
    }

    /**
     * Retirer un enfant du groupe — uniquement propriétaire
     */
    public function detachChild(User $user, Group $group): bool
    {
        return $user->iduser === $group->iduser;
    }
}
