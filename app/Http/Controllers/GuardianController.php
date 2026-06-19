<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guardian\StoreGuardianRequest;
use App\Http\Requests\Guardian\UpdateGuardianRequest;
use App\Models\Guardian;
use App\Services\GuardianService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private GuardianService $guardianService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Guardian::class);

        return response()->json([
            'data' => $this->guardianService->getAll(),
        ]);
    }

    public function store(StoreGuardianRequest $request): JsonResponse
    {
        $this->authorize('create', Guardian::class);

        $guardian = $this->guardianService->create($request->validated());

        if ($request->filled('children')) {
            $guardian->children()->sync($request->children);
        }

        return response()->json([
            'message' => 'Guardian created successfully',
            'data' => $guardian->load('children'),
        ], 201);
    }

    public function show(Guardian $guardian): JsonResponse
    {
        $this->authorize('view', $guardian);

        return response()->json([
            'data' => $guardian->load('children'),
        ]);
    }

    public function update(UpdateGuardianRequest $request, Guardian $guardian): JsonResponse
    {
        $this->authorize('update', $guardian);

        $updated = $this->guardianService->update($guardian, $request->validated());

        if ($request->has('children')) {
            $updated->children()->sync($request->children);
        }

        return response()->json([
            'message' => 'Guardian updated successfully',
            'data' => $updated->load('children'),
        ]);
    }

    public function destroy(Guardian $guardian): JsonResponse
    {
        $this->authorize('delete', $guardian);

        $this->guardianService->delete($guardian);

        return response()->json([
            'message' => 'Guardian deleted successfully',
        ]);
    }

    public function addChild(Guardian $guardian, Request $request): JsonResponse
    {
        $this->authorize('update', $guardian);

        $request->validate([
            'child_id' => 'required|exists:children,idchildren',
        ]);

        $this->guardianService->attachChild($guardian, $request->child_id);

        return response()->json([
            'message' => 'Child added to guardian',
        ]);
    }

    public function removeChild(Guardian $guardian, Request $request): JsonResponse
    {
        $this->authorize('update', $guardian);

        $request->validate([
            'child_id' => 'required|exists:children,idchildren',
        ]);

        $this->guardianService->detachChild($guardian, $request->child_id);

        return response()->json([
            'message' => 'Child removed from guardian',
        ]);
    }
}
