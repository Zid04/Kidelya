<?php

namespace App\Services;

use App\Models\Theme;

class ThemeService
{
    //permet de récupérer tous les thèmes avec leurs activités associées

    public function getAll()
    {
        return Theme::with('activities')->latest()->get();
    }

//permet de créer un thème

    public function create(array $data): Theme
    {
        return Theme::create($data);
    }

//permet de mettre à jour un thème

    public function update(Theme $theme, array $data): Theme
    {
        $theme->update($data);

        return $theme->fresh();
    }

//permet de supprimer un thème

    public function delete(Theme $theme): void
    {
        $theme->delete();
    }

    /**
     * ATTACH activity to theme
     */
    public function attachActivity(Theme $theme, int $activityId): void
    {
        if (!$theme->activities()->where('IdActivities', $activityId)->exists()) {
            $theme->activities()->attach($activityId);
        }
    }

    /**
     * DETACH activity
     */
    public function detachActivity(Theme $theme, int $activityId): void
    {
        $theme->activities()->detach($activityId);
    }
}