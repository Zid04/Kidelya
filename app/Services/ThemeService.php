<?php

namespace App\Services;

use App\Models\Theme;

class ThemeService
{
    /**
     * Récupérer tous les thèmes avec leurs activités associées
     */
    public function getAll()
    {
        return Theme::with('activities')
            ->latest()
            ->get();
    }

    /**
     * Créer un thème
     */
    public function create(array $data): Theme
    {
        return Theme::create($data);
    }

    /**
     * Mettre à jour un thème
     */
    public function update(Theme $theme, array $data): Theme
    {
        $theme->update($data);
        return $theme->fresh();
    }

    /**
     * Supprimer un thème
     */
    public function delete(Theme $theme): void
    {
        $theme->delete();
    }

    /**
     * Ajouter une activité au thème
     */
    public function attachActivity(Theme $theme, int $activityId): void
    {
        if (!$theme->activities()->where('idactivities', $activityId)->exists()) {
            $theme->activities()->attach($activityId);
        }
    }

    /**
     * Retirer une activité du thème
     */
    public function detachActivity(Theme $theme, int $activityId): void
    {
        $theme->activities()->detach($activityId);
    }
}
