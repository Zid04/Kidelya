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
        return Activity::with(['user', 'themes', 'competences'])

            // Filtre : âge
            ->when(isset($filters['age']), function ($query) use ($filters) {
                $query->where('agemin', '<=', $filters['age'])
                    ->where('agemax', '>=', $filters['age']);
            })

            // Filtre : saison
            ->when(isset($filters['season']), function ($query) use ($filters) {
                $query->where('season', 'LIKE', '%'.$filters['season'].'%');
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

            // Filtre : statut de publication
            ->when(isset($filters['published']), function ($query) use ($filters) {
                $query->where('is_published', (bool) $filters['published']);
            })

            // Filtre : achetable
            ->when(isset($filters['purchasable']), function ($query) use ($filters) {
                $query->where('is_purchasable', (bool) $filters['purchasable']);
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

    /**
     * Publie une activité.
     */
    public function publish(Activity $activity): Activity
    {
        $activity->update(['is_published' => true]);

        return $activity->fresh();
    }

    /**
     * Dépublie une activité.
     */
    public function unpublish(Activity $activity): Activity
    {
        $activity->update(['is_published' => false]);

        return $activity->fresh();
    }
}
