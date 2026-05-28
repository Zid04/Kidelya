<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Pack::published()
            ->with(['activities' => function ($query) {
                $query->select('activities.idactivities', 'activities.agemin', 'activities.agemax', 'activities.season')
                    ->with('themes:idtheme,name');
            }])
            ->orderByDesc('created_at');

        $search = trim((string) $request->input('search', ''));
        if ($search !== '') {
            $query->where('title', 'like', "%{$search}%");
        }

        $type = trim((string) $request->input('type', ''));
        if ($type !== '') {
            $query->where('type', $type);
        }

        $season = trim((string) $request->input('season', ''));
        if ($season !== '') {
            $query->whereHas('activities', function ($query) use ($season) {
                $query->where('season', $season);
            });
        }

        $age = trim((string) $request->input('age', ''));
        if ($age !== '') {
            [$minAge, $maxAge] = array_map('intval', explode('-', $age, 2));

            $query->whereHas('activities', function ($query) use ($minAge, $maxAge) {
                $query->where('agemin', '<=', $maxAge)
                    ->where('agemax', '>=', $minAge);
            });
        }

        $theme = trim((string) $request->input('theme', ''));
        if ($theme !== '') {
            $query->whereHas('activities.themes', function ($query) use ($theme) {
                $query->where('name', $theme);
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $perPage = max(1, min($perPage, 50));

        $paginator = $query->paginate($perPage, ['*'], 'page', (int) $request->input('page', 1));

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'filters' => $this->buildFilters(),
        ]);
    }

    public function show(Pack $pack): JsonResponse
    {
        abort_unless($pack->is_published, 404);

        $pack->load('activities');

        return response()->json([
            'data' => $pack,
        ]);
    }

    private function buildFilters(): array
    {
        $packs = Pack::published()
            ->with(['activities' => function ($query) {
                $query->select('activities.idactivities', 'activities.agemin', 'activities.agemax', 'activities.season')
                    ->with('themes:idtheme,name');
            }])
            ->get();

        $types = $packs
            ->pluck('type')
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();

        $seasons = $packs
            ->flatMap(fn (Pack $pack) => $pack->activities)
            ->pluck('season')
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();

        $ageRanges = $packs
            ->flatMap(fn (Pack $pack) => $pack->activities)
            ->map(function ($activity) {
                if ($activity->agemin === null && $activity->agemax === null) {
                    return null;
                }

                if ($activity->agemin === null) {
                    return sprintf('0-%d ans', $activity->agemax);
                }

                if ($activity->agemax === null) {
                    return sprintf('%d+ ans', $activity->agemin);
                }

                return sprintf('%d-%d ans', $activity->agemin, $activity->agemax);
            })
            ->filter()
            ->unique()
            ->sortBy(fn ($range) => explode('-', (string) $range)[0])
            ->values()
            ->all();

        $themes = $packs
            ->flatMap(fn (Pack $pack) => $pack->activities)
            ->flatMap(fn ($activity) => $activity->themes ?? [])
            ->pluck('name')
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();

        return [
            'types' => $types,
            'seasons' => $seasons,
            'age_ranges' => $ageRanges,
            'themes' => $themes,
        ];
    }
}
