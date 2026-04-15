<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Services\IdeaService;
use App\Http\Requests\Idea\StoreIdeaRequest;
use App\Http\Requests\Idea\UpdateIdeaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IdeaController extends Controller
{
    public function __construct(
        private IdeaService $ideaService
    ) {}
//cette fonction index() permet de récupérer toutes les idées d'un utilisateur authentifié et de les retourner au format JSON.
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->ideaService->getAllForUser(auth()->user())
        ]);
    }
//permet de créer une nouvelle idée en utilisant les données validées de la requête et l'utilisateur authentifié, puis de retourner un message de succès 
    public function store(StoreIdeaRequest $request): JsonResponse
    {
        $this->authorize('create', Idea::class);

        return response()->json([
            'message' => 'Idea created successfully',
            'data' => $this->ideaService->create(
                $request->validated(),
                auth()->user()
            )
        ], 201);
    }
//permet de récupérer une idée spécifique, de vérifier si l'utilisateur a l'autorisation de la voir, puis de retourner les données de l'idée au format JSON.
    public function show(Idea $idea): JsonResponse
    {
        $this->authorize('view', $idea);

        return response()->json([
            'data' => $idea
        ]);} 
//permet de mettre à jour une idée spécifique en utilisant les données validées de la requête, puis de retourner un message de succès 
    public function update(UpdateIdeaRequest $request, Idea $idea): JsonResponse
    {
        $this->authorize('update', $idea);

        return response()->json([
            'message' => 'Idea updated successfully',
            'data' => $this->ideaService->update($idea, $request->validated())
        ]);
    }
//permet de supprimer une idée spécifique, puis de retourner un message de succès
    public function destroy(Idea $idea): JsonResponse
    {
        $this->authorize('delete', $idea);

        $this->ideaService->delete($idea);

        return response()->json([
            'message' => 'Idea deleted successfully'
        ]);
    }
}