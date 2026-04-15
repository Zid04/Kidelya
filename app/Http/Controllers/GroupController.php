<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Services\GroupService;
use App\Http\Requests\Group\StoreGroupRequest;
use App\Http\Requests\Group\UpdateGroupRequest;
use Illuminate\Http\JsonResponse;

class GroupController extends Controller
{
    public function __construct(
        private GroupService $groupService
    ) {}

    /**
     * GET /api/groups
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->groupService->getAllForUser(auth()->user())
        ]);
    }

    /**
     * POST /api/groups
     */
    public function store(StoreGroupRequest $request): JsonResponse
    {
        $this->authorize('create', Group::class);

        $group = $this->groupService->create(
            $request->validated(),
            auth()->user()
        );

        return response()->json([
            'message' => 'Group created successfully',
            'data' => $group
        ], 201);
    }

    /**
     * GET /api/groups/{group}
     */
    public function show(Group $group): JsonResponse
    {
        $this->authorize('view', $group);

        return response()->json([
            'data' => $group->load('children')
        ]);
    }

    /**
     * PUT /api/groups/{group}
     */
    public function update(UpdateGroupRequest $request, Group $group): JsonResponse
    {
        $this->authorize('update', $group);

        return response()->json([
            'message' => 'Group updated successfully',
            'data' => $this->groupService->update($group, $request->validated())
        ]);
    }

    /**
     * DELETE /api/groups/{group}
     */
    public function destroy(Group $group): JsonResponse
    {
        $this->authorize('delete', $group);

        $this->groupService->delete($group);

        return response()->json([
            'message' => 'Group deleted successfully'
        ]);
    }
    // POST /api/groups/{group}/children
    public function addChild(Group $group, Request $request): JsonResponse
{
    $this->authorize('update', $group);

    $request->validate([
        'child_id' => 'required|exists:children,IdChildren',
    ]);

    $this->groupService->addChild($group, $request->child_id);

    return response()->json([
        'message' => 'Child added to group successfully'
    ]);
}
// DELETE /api/groups/{group}/children
public function removeChild(Group $group, Request $request): JsonResponse
{
    $this->authorize('update', $group);

    $request->validate([
        'child_id' => 'required|exists:children,IdChildren',
    ]);

    $this->groupService->removeChild($group, $request->child_id);

    return response()->json([
        'message' => 'Child removed from group successfully'
    ]);
}
}