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
     * Liste des packs (admin)
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Pack::class);

        return response()->json([
            'data' => $this->packService->getDashboardPacks(auth()->user())
        ]);
    }

    /**
     * Créer un pack
     */
    public function store(StorePackRequest $request): JsonResponse
    {
        $this->authorize('create', Pack::class);

        return response()->json([
            'message' => 'Pack created successfully',
            'data' => $this->packService->create($request->validated(), auth()->user())
        ], 201);
    }

    /**
     * Afficher un pack
     */
    public function show(Pack $pack): JsonResponse
    {
        $this->authorize('view', $pack);

        return response()->json([
            'data' => $pack->load(['creator', 'activities'])
        ]);
    }

    /**
     * Modifier un pack
     */
    public function update(UpdatePackRequest $request, Pack $pack): JsonResponse
    {
        $this->authorize('update', $pack);

        return response()->json([
            'message' => 'Pack updated successfully',
            'data' => $this->packService->update($pack, $request->validated())
        ]);
    }

    /**
     * Supprimer un pack
     */
    public function destroy(Pack $pack): JsonResponse
    {
        $this->authorize('delete', $pack);

        $this->packService->delete($pack);

        return response()->json([
            'message' => 'Pack deleted successfully'
        ]);
    }

    /**
     * Ajouter une activité dans un pack
     */
    public function addActivity(Pack $pack, Request $request): JsonResponse
    {
        $this->authorize('update', $pack);

        $request->validate([
            'activity_id' => 'required|exists:activities,idactivities'
        ]);

        $this->packService->attachActivity($pack, $request->activity_id);

        return response()->json([
            'message' => 'Activity added to pack'
        ]);
    }

    /**
     * Retirer une activité d’un pack
     */
    public function removeActivity(Pack $pack, Request $request): JsonResponse
    {
        $this->authorize('update', $pack);

        $request->validate([
            'activity_id' => 'required|exists:activities,idactivities'
        ]);

        $this->packService->detachActivity($pack, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from pack'
        ]);
    }

    /**
     * Publier un pack
     */
    public function publish(Pack $pack): JsonResponse
    {
        $this->authorize('update', $pack);

        $updated = $this->packService->publish($pack);

        return response()->json([
            'message' => 'Pack published successfully',
            'data'    => $updated
        ]);
    }

    /**
     * Dépublier un pack
     */
    public function unpublish(Pack $pack): JsonResponse
    {
        $this->authorize('update', $pack);

        $updated = $this->packService->unpublish($pack);

        return response()->json([
            'message' => 'Pack unpublished successfully',
            'data'    => $updated
        ]);
    }
}
