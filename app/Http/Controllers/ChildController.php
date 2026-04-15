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
    public function index()
    {
        return $this->childService->getAllForUser(auth()->user());
    }

    /**
     * Création
     */
    public function store(StoreChildRequest $request)
    {
        $this->authorize('create', Child::class);

        return $this->childService->create($request->validated());
    }

    /**
     * Détails enfant
     */
    public function show(Child $child)
    {
        $this->authorize('view', $child);

        return $child->load(['parents', 'groups', 'plannings']);
    }

    /**
     * Mise à jour
     */
    public function update(UpdateChildRequest $request, Child $child)
    {
        $this->authorize('update', $child);

        return $this->childService->update($child, $request->validated());
    }

    /**
     * Suppression
     */
    public function destroy(Child $child)
    {
        $this->authorize('delete', $child);

        $this->childService->delete($child);

        return response()->json([
            'message' => 'Child deleted'
        ]);
    }
}