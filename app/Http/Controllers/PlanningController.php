<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use Illuminate\Http\JsonResponse;

use App\Services\PlanningService;

use App\Http\Requests\Planning\StorePlanningRequest;
use App\Http\Requests\Planning\UpdatePlanningRequest;
use App\Http\Requests\Planning\AddActivityToPlanningRequest;
use App\Http\Requests\Planning\AddGroupToPlanningRequest;
use App\Http\Requests\Planning\AddChildToPlanningRequest;

/**
 * Controller Planning 
 *
 * Responsabilité :
 * - recevoir les requêtes
 * - appeler le service métier
 * - gérer les autorisations
 * - retourner JSON
 */
class PlanningController extends Controller
{
    public function __construct(
        private PlanningService $planningService
    ) {}

    /**
     * LISTE DES PLANNINGS
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        $this->authorize('viewAny', Planning::class);

        return response()->json([
            'data' => $this->planningService->getAllForUser($user)
        ]);
    }

    /**
     * CREATE PLANNING
     */
    public function store(StorePlanningRequest $request): JsonResponse
    {
        $user = auth()->user();
        $this->authorize('create', Planning::class);

        $planning = $this->planningService->create(
            $request->validated(),
            $user
        );

        return response()->json([
            'message' => 'Planning created successfully',
            'data' => $planning
        ], 201);
    }

    /**
     * SHOW PLANNING
     */
    public function show(Planning $planning): JsonResponse
    {
        $this->authorize('view', $planning);

        return response()->json([
            'data' => $planning->load([
                'activities',
                'groups',
                'children',
                'user',
                'reportActivity'
            ])
        ]);
    }

    /**
     * UPDATE PLANNING
     */
    public function update(UpdatePlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        return response()->json([
            'message' => 'Planning updated successfully',
            'data' => $this->planningService->update(
                $planning,
                $request->validated()
            )
        ]);
    }

    /**
     * DELETE PLANNING
     */
    public function destroy(Planning $planning): JsonResponse
    {
        $this->authorize('delete', $planning);

        $this->planningService->delete($planning);

        return response()->json([
            'message' => 'Planning deleted successfully'
        ]);
    }

    /**
     * ADD ACTIVITY TO PLANNING
     */
    public function addActivity(AddActivityToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachActivity(
            $planning,
            $request->activity_id
        );

        return response()->json([
            'message' => 'Activity added to planning'
        ]);
    }

    /**
     * ADD GROUP TO PLANNING
     */
    public function addGroup(AddGroupToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachGroup(
            $planning,
            $request->group_id
        );

        return response()->json([
            'message' => 'Group added to planning'
        ]);
    }

    /**
     * ADD CHILD TO PLANNING
     */
    public function addChild(AddChildToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachChild(
            $planning,
            $request->child_id
        );

        return response()->json([
            'message' => 'Child added to planning'
        ]);
    }
    /**
 * REMOVE ACTIVITY FROM PLANNING
 */
public function removeActivity(RemoveActivityFromPlanningRequest $request, Planning $planning): JsonResponse
{
    $this->authorize('update', $planning);

    $this->planningService->detachActivity(
        $planning,
        $request->activity_id
    );

    return response()->json([
        'message' => 'Activity removed from planning'
    ]);
}
/**
 * REMOVE GROUP FROM PLANNING
 */
public function removeGroup(RemoveGroupFromPlanningRequest $request, Planning $planning): JsonResponse
{
    $this->authorize('update', $planning);

    $this->planningService->detachGroup(
        $planning,
        $request->group_id
    );

    return response()->json([
        'message' => 'Group removed from planning'
    ]);
}

/**
 * REMOVE CHILD FROM PLANNING
 */
public function removeChild(RemoveChildFromPlanningRequest $request, Planning $planning): JsonResponse
{
    $this->authorize('update', $planning);

    $this->planningService->detachChild(
        $planning,
        $request->child_id
    );

    return response()->json([
        'message' => 'Child removed from planning'
    ]);
}
}