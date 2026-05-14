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

use App\Http\Requests\Planning\RemoveActivityFromPlanningRequest;
use App\Http\Requests\Planning\RemoveGroupFromPlanningRequest;
use App\Http\Requests\Planning\RemoveChildFromPlanningRequest;

class PlanningController extends Controller
{
    public function __construct(
        private PlanningService $planningService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Planning::class);

        return response()->json([
            'data' => $this->planningService->getAllForUser(auth()->user())
        ]);
    }

    public function store(StorePlanningRequest $request): JsonResponse
    {
        $this->authorize('create', Planning::class);

        $planning = $this->planningService->create(
            $request->validated(),
            auth()->user()
        );

        return response()->json([
            'message' => 'Planning created successfully',
            'data' => $planning
        ], 201);
    }

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

    public function update(UpdatePlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        return response()->json([
            'message' => 'Planning updated successfully',
            'data' => $this->planningService->update($planning, $request->validated())
        ]);
    }

    public function destroy(Planning $planning): JsonResponse
    {
        $this->authorize('delete', $planning);

        $this->planningService->delete($planning);

        return response()->json([
            'message' => 'Planning deleted successfully'
        ]);
    }

    public function addActivity(AddActivityToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachActivity($planning, $request->activity_id);

        return response()->json([
            'message' => 'Activity added to planning'
        ]);
    }

    public function addGroup(AddGroupToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachGroup($planning, $request->group_id);

        return response()->json([
            'message' => 'Group added to planning'
        ]);
    }

    public function addChild(AddChildToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachChild($planning, $request->child_id);

        return response()->json([
            'message' => 'Child added to planning'
        ]);
    }

    public function removeActivity(RemoveActivityFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachActivity($planning, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from planning'
        ]);
    }

    public function removeGroup(RemoveGroupFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachGroup($planning, $request->group_id);

        return response()->json([
            'message' => 'Group removed from planning'
        ]);
    }

    public function removeChild(RemoveChildFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachChild($planning, $request->child_id);

        return response()->json([
            'message' => 'Child removed from planning'
        ]);
    }
}
