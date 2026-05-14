<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    public function __construct(
        private readonly ActivityService $activityService
    ) {}

    /**
     * Liste paginée des activités (admin + filtres)
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Activity::class);
        
        $validated = $request->validate([
            'age'           => 'nullable|integer|min:0',
            'season'        => 'nullable|string|max:50',
            'themes'        => 'nullable|array',
            'themes.*'      => 'integer|exists:themes,idtheme',
            'competences'   => 'nullable|array',
            'competences.*' => 'integer|exists:competences,idcompetence',
            'published'     => 'nullable|boolean',
            'purchasable'   => 'nullable|boolean',
        ]);

        return response()->json([
            'data' => $this->activityService->getPaginated($validated),
        ]);
    }

    /**
     * Afficher une activité
     */
    public function show(Activity $activity): JsonResponse
    {
        $this->authorize('view', $activity);

        return response()->json([
            'data' => $activity->load([
                'user',
                'themes',
                'competences',
                'plannings',
                'packs'
            ])
        ]);
    }

    /**
     * Créer une activité
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $this->authorize('create', Activity::class);

        $activity = $this->activityService->create($request->validated());

        return response()->json([
            'message' => 'Activity created successfully',
            'data'    => $activity
        ], 201);
    }

    /**
     * Modifier une activité
     */
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->update($activity, $request->validated());

        return response()->json([
            'message' => 'Activity updated successfully',
            'data'    => $updated
        ]);
    }

    /**
     * Supprimer une activité
     */
    public function destroy(Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);

        $this->activityService->delete($activity);

        return response()->json([
            'message' => 'Activity deleted successfully'
        ]);
    }

    /**
     * Publier une activité
     */
    public function publish(Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->publish($activity);

        return response()->json([
            'message' => 'Activity published successfully',
            'data'    => $updated
        ]);
    }

    /**
     * Dépublier une activité
     */
    public function unpublish(Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->unpublish($activity);

        return response()->json([
            'message' => 'Activity unpublished successfully',
            'data'    => $updated
        ]);
    }
}
