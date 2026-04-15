<?php

namespace App\Services;

use App\Models\Activity;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityService
{
    /**
     * Récupère les activités paginées avec leurs relations.
     */

    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Activity::with(['user', 'themes', 'competences', 'plannings', 'packs'])

            /*
            |------------------------------------------------------------------
            | Filter : Age
            |------------------------------------------------------------------
            | Retourne les activités dont la tranche d'âge
            | correspond à l'âge recherché.
            | Ex: age=8 → AgeMin <= 8 <= AgeMax
            */
            ->when(isset($filters['age']), function ($query) use ($filters) {
                $query->where('AgeMin', '<=', $filters['age'])
                      ->where('AgeMax', '>=', $filters['age']);
            })

            /*
            |------------------------------------------------------------------
            | Filter : Season
            |------------------------------------------------------------------
            | Filtre par saison (ex: "Summer", "Winter").
            | Recherche insensible à la casse via LIKE.
            */
            ->when(isset($filters['season']), function ($query) use ($filters) {
                $query->where('Season', 'LIKE', '%' . $filters['season'] . '%');
            })

            /*
            |------------------------------------------------------------------
            | Filter : Themes
            |------------------------------------------------------------------
            | Filtre les activités ayant au moins un des thèmes sélectionnés.
            */
            ->when(isset($filters['themes']), function ($query) use ($filters) {
                $query->whereHas('themes', function ($q) use ($filters) {
                    $q->whereIn('IdTheme', (array) $filters['themes']);
                });
            })

            /*
            |------------------------------------------------------------------
            | Filter : Competences
            |------------------------------------------------------------------
            | Filtre les activités ayant au moins une des compétences sélectionnées.
            */
            ->when(isset($filters['competences']), function ($query) use ($filters) {
                $query->whereHas('competences', function ($q) use ($filters) {
                    $q->whereIn('IdCompetence', (array) $filters['competences']);
                });
            })

            ->latest()
            ->paginate($perPage)

            /*
            |------------------------------------------------------------------
            | withQueryString()
            |------------------------------------------------------------------
            | Conserve les paramètres de filtre dans les liens de pagination.
            | Sans ça, la page 2 perdrait les filtres actifs.
            */
            ->withQueryString();
    }
   
    /**
     * Crée une nouvelle activité.
     */
    public function create(array $data): Activity
    {
        return Activity::create($data);
    }

    /**
     * Met à jour une activité existante.
     */
    public function update(Activity $activity, array $data): Activity
    {
        $activity->update($data);

        return $activity->fresh();
    }

    /**
     * Supprime une activité.
     */
    public function delete(Activity $activity): void
    {
        $activity->delete();
    }
}