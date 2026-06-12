<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Services\IdeaService;
use App\Http\Requests\Idea\StoreIdeaRequest;
use App\Http\Requests\Idea\UpdateIdeaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class IdeaController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private IdeaService $ideaService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Idea::class);

        return response()->json([
            'data' => $this->ideaService->getAllForUser(auth()->user())
        ]);
    }

    public function store(StoreIdeaRequest $request): JsonResponse
    {
        $this->authorize('create', Idea::class);

        return response()->json([
            'message' => 'Idée créée avec succès',
            'data' => $this->ideaService->create(
                $request->validated(),
                auth()->user()
            )
        ], 201);
    }

    public function show(Idea $idea): JsonResponse
    {
        $this->authorize('view', $idea);

        return response()->json([
            'data' => $idea
        ]);
    }

    public function update(UpdateIdeaRequest $request, Idea $idea): JsonResponse
    {
        $this->authorize('update', $idea);

        return response()->json([
            'message' => 'Idée mise à jour',
            'data' => $this->ideaService->update($idea, $request->validated())
        ]);
    }

    public function destroy(Idea $idea): JsonResponse
    {
        $this->authorize('delete', $idea);

        $this->ideaService->delete($idea);

        return response()->json([
            'message' => 'Idée supprimée'
        ]);
    }

    /**
     * Convertit une idée en brouillon d'activité.
     */
    public function convertToActivity(Idea $idea): JsonResponse
    {
        $this->authorize('convert', $idea);

        $activity = $this->ideaService->convertToActivity($idea, auth()->user());

        return response()->json([
            'message' => 'Idée convertie en activité brouillon',
            'data'    => $activity,
        ], 201);
    }
}
