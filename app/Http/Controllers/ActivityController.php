<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Controller API REST des activités
 *
 * - Validation : FormRequests
 * - Logique métier : ActivityService
 * - Sécurité : ActivityPolicy
 * - Réponses : JSON uniquement
 */
class ActivityController extends Controller
{
    public function __construct(
        private readonly ActivityService $activityService
    ) {}

    /**
     * GET /api/activities
     * Liste paginée avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        // Validation des filtres 
        $validated = $request->validate([
            'age'           => 'nullable|integer|min:0',
            'season'        => 'nullable|string|max:50',
            'themes'        => 'nullable|array',
            'themes.*'      => 'integer|exists:themes,IdTheme',
            'competences'   => 'nullable|array',
            'competences.*' => 'integer|exists:competences,IdCompetence',
        ]);

        return response()->json([
            'data' => $this->activityService->getPaginated($validated),
        ]);
    }

    /**
     * GET /api/activities/{activity}
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
     * POST /api/activities
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
     * PUT /api/activities/{activity}
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
     * DELETE /api/activities/{activity}
     */
    public function destroy(Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);

        $this->activityService->delete($activity);

        return response()->json([
            'message' => 'Activity deleted successfully'
        ]);
    }
}