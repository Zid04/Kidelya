<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Services\ChildService;
use App\Http\Requests\Child\StoreChildRequest;
use App\Http\Requests\Child\UpdateChildRequest;

class ChildController extends Controller
{
    public function __construct(
        private ChildService $childService
    ) {}

    /**
     * Liste des enfants assiciés a l'utilisateur connecté
     */
    public function index():JsonResponse
    {
        return response()->json(['data' => $this->childService->getAllForUser(auth()->user())]);
    }

    /**
     * Création
     */
    public function store(StoreChildRequest $request):JsonResponse
    {
        $this->authorize('create', Child::class);

        return response()->json([
    'message' => 'Child created successfully',
    'data'    => $this->childService->create($request->validated())
], 201);
    }

    /**
     * Détails enfant
     */
    public function show(Child $child):JsonResponse
    {
        $this->authorize('view', $child);
return response()->json(['data' => $child->load(['parents', 'groups', 'plannings'])]);
    }

    /**
     * Mise à jour
     */
    public function update(UpdateChildRequest $request, Child $child):JsonResponse
    {
        $this->authorize('update', $child);

        return $this->childService->update($child, $request->validated());
    }

    /**
     * Suppression
     */
    public function destroy(Child $child):JsonResponse
    {
        $this->authorize('delete', $child);

        $this->childService->delete($child);

        return response()->json([
            'message' => 'Child deleted'
        ]);
    }
}