<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Services\PackService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Pack\StorePackRequest;
use App\Http\Requests\Pack\UpdatePackRequest;

class PackController extends Controller
{
    public function __construct(
        private PackService $packService
    ) {}

    /**
     * DASHBOARD PACKS
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->packService->getDashboardPacks(auth()->user())
            
        ]);
    }

    public function store(StorePackRequest $request): JsonResponse
    {
        $this->authorize('create', Pack::class);

        return response()->json([
            'message' => 'Pack created successfully',
            'data' => $this->packService->create($request->validated(), auth()->user())
        ], 201);
    }

    public function show(Pack $pack): JsonResponse
    {
        $this->authorize('view', $pack); 
        return response()->json([
            'data' => $pack->load(['creator', 'activities'])
        ]);
    }

    public function update(UpdatePackRequest $request, Pack $pack): JsonResponse
    {
        $this->authorize('update', $pack);

        return response()->json([
            'message' => 'Pack updated successfully',
            'data' => $this->packService->update($pack, $request->validated())
        ]);
    }

    public function destroy(Pack $pack): JsonResponse
    {
        $this->authorize('delete', $pack);

        $this->packService->delete($pack);

        return response()->json([
            'message' => 'Pack deleted successfully'
        ]);
    }

    /**
     * Ajouter activité
     */
    public function addActivity(Pack $pack, Request $request): JsonResponse
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,IdActivities'
        ]);

        $this->packService->attachActivity($pack, $request->activity_id);

        return response()->json([
            'message' => 'Activity added to pack'
        ]);
    }

    /**
     * Retirer activité
     */
    public function removeActivity(Pack $pack, Request $request): JsonResponse
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,IdActivities'
        ]);

        $this->packService->detachActivity($pack, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from pack'
        ]);
    }
}