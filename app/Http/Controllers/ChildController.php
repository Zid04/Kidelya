<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Services\ChildService;
use App\Http\Requests\Child\StoreChildRequest;
use App\Http\Requests\Child\UpdateChildRequest;
use Illuminate\Http\JsonResponse;

class ChildController extends Controller
{
    public function __construct(
        private ChildService $childService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Child::class);

        return response()->json([
            'data' => $this->childService->getAllForUser(auth()->user())
        ]);
    }

    public function store(StoreChildRequest $request): JsonResponse
    {
        $this->authorize('create', Child::class);

        return response()->json([
            'message' => 'Child created successfully',
            'data'    => $this->childService->create($request->validated())
        ], 201);
    }

    public function show(Child $child): JsonResponse
    {
        $this->authorize('view', $child);

        return response()->json([
            'data' => $child->load(['parents', 'groups', 'plannings'])
        ]);
    }

    public function update(UpdateChildRequest $request, Child $child): JsonResponse
    {
        $this->authorize('update', $child);

        return response()->json([
            'message' => 'Child updated successfully',
            'data'    => $this->childService->update($child, $request->validated())
        ]);
    }

    public function destroy(Child $child): JsonResponse
    {
        $this->authorize('delete', $child);

        $this->childService->delete($child);

        return response()->json([
            'message' => 'Child deleted'
        ]);
    }
}
