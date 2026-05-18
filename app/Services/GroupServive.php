<?php

namespace App\Services;

use App\Models\Group;
use App\Models\User;

class GroupService
{
    /**
     * Liste des groupes utilisateur
     */
    public function getAllForUser(User $user)
    {
        return Group::where('iduser', $user->iduser)
            ->with('children')
            ->latest()
            ->get();
    }

    /**
     * Création groupe
     */
    public function create(array $data, User $user): Group
    {
        $data['iduser'] = $user->iduser;

        return Group::create($data);
    }

    /**
     * Mise à jour
     */
    public function update(Group $group, array $data): Group
    {
        $group->update($data);

        return $group->fresh();
    }

    /**
     * Ajout enfant au groupe
     */
    public function addChild(Group $group, int $childId): void
    {
        // évite doublons
        if (!$group->children()->where('idchildren', $childId)->exists()) {
            $group->children()->attach($childId);
        }
    }

    /**
     * Retrait enfant du groupe
     */
    public function removeChild(Group $group, int $childId): void
    {
        $group->children()->detach($childId);
    }

    /**
     * Suppression
     */
    public function delete(Group $group): void
    {
        $group->delete();
    }
}
