<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Services\GuardianService;
use App\Http\Requests\Guardian\StoreGuardianRequest;
use App\Http\Requests\Guardian\UpdateGuardianRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    public function __construct(
        private GuardianService $guardianService
    ) {}
//   afficher tous les parents
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->guardianService->getAll()
        ]);
    }
//   créer un parent
    public function store(StoreGuardianRequest $request): JsonResponse
    {
        $this->authorize('create', Guardian::class);

        return response()->json([
            'message' => 'Guardian created successfully',
            'data' => $this->guardianService->create($request->validated())
        ], 201);
    }
//   afficher un parent
    public function show(Guardian $guardian): JsonResponse
    {
        $this->authorize('view', $guardian);

        return response()->json([
            'data' => $guardian->load('children')
        ]);
    }
//   modifier un parent
    public function update(UpdateGuardianRequest $request, Guardian $guardian): JsonResponse
    {
        $this->authorize('update', $guardian);

        return response()->json([
            'message' => 'Guardian updated successfully',
            'data' => $this->guardianService->update($guardian, $request->validated())
        ]);
    }
//   supprimer un parent
     
    public function destroy(Guardian $guardian): JsonResponse
    {
        $this->authorize('delete', $guardian);

        $this->guardianService->delete($guardian);

        return response()->json([
            'message' => 'Guardian deleted successfully'
        ]);
    }

    /**
     * lier enfant
     */
    public function addChild(Guardian $guardian, Request $request): JsonResponse
    {
        $request->validate([
            'child_id' => 'required|exists:children,IdChildren'
        ]);

        $this->guardianService->attachChild($guardian, $request->child_id);

        return response()->json([
            'message' => 'Child added to guardian'
        ]);
    }

    /**
     * delier enfant
     */
    public function removeChild(Guardian $guardian, Request $request): JsonResponse
    {
        $request->validate([
            'child_id' => 'required|exists:children,IdChildren'
        ]);

        $this->guardianService->detachChild($guardian, $request->child_id);

        return response()->json([
            'message' => 'Child removed from guardian'
        ]);
    }
}