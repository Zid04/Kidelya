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

            // Filtre : âge
            ->when(isset($filters['age']), function ($query) use ($filters) {
                $query->where('agemin', '<=', $filters['age'])
                      ->where('agemax', '>=', $filters['age']);
            })

            // Filtre : saison
            ->when(isset($filters['season']), function ($query) use ($filters) {
                $query->where('season', 'LIKE', '%' . $filters['season'] . '%');
            })

            // Filtre : thèmes
            ->when(isset($filters['themes']), function ($query) use ($filters) {
                $query->whereHas('themes', function ($q) use ($filters) {
                    $q->whereIn('idtheme', (array) $filters['themes']);
                });
            })

            // Filtre : compétences
            ->when(isset($filters['competences']), function ($query) use ($filters) {
                $query->whereHas('competences', function ($q) use ($filters) {
                    $q->whereIn('idcompetence', (array) $filters['competences']);
                });
            })

            ->latest()
            ->paginate($perPage)
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
