<?php

namespace App\Services;

use App\Models\Planning;
use App\Models\User;

class PlanningService
{
    /**
     * Récupérer tous les plannings d’un utilisateur
     */
    public function getAllForUser(User $user)
    {
        return Planning::with([
                'activities',
                'groups',
                'children',
                'user',
                'reportActivity'
            ])
            ->where('iduser', $user->iduser)
            ->latest()
            ->get();
    }

    /**
     * Créer un planning
     */
    public function create(array $data, User $user): Planning
    {
        $data['iduser'] = $user->iduser;

        $planning = Planning::create($data);

        return $planning->load([
            'activities',
            'groups',
            'children',
            'user'
        ]);
    }

    /**
     * Mettre à jour un planning
     */
    public function update(Planning $planning, array $data): Planning
    {
        $planning->update($data);

        return $planning->fresh()->load([
            'activities',
            'groups',
            'children',
            'user',
            'reportActivity'
        ]);
    }

    /**
     * Supprimer un planning
     */
    public function delete(Planning $planning): void
    {
        // detach relations propres (bonne pratique)
        $planning->activities()->detach();
        $planning->groups()->detach();
        $planning->children()->detach();

        $planning->delete();
    }

    /**
     * Ajouter une activité au planning
     */
    public function attachActivity(Planning $planning, int $activityId): void
    {
        $planning->activities()->syncWithoutDetaching([$activityId]);
    }

    /**
     * Ajouter un groupe au planning
     */
    public function attachGroup(Planning $planning, int $groupId): void
    {
        $planning->groups()->syncWithoutDetaching([$groupId]);
    }

    /**
     * Ajouter un enfant au planning
     */
    public function attachChild(Planning $planning, int $childId): void
    {
        $planning->children()->syncWithoutDetaching([$childId]);
    }
}
