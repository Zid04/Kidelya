<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Services\IdeaService;
use App\Http\Requests\Idea\StoreIdeaRequest;
use App\Http\Requests\Idea\UpdateIdeaRequest;
use Illuminate\Http\JsonResponse;

class IdeaController extends Controller
{
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
            'message' => 'Idea created successfully',
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
            'message' => 'Idea updated successfully',
            'data' => $this->ideaService->update($idea, $request->validated())
        ]);
    }

    public function destroy(Idea $idea): JsonResponse
    {
        $this->authorize('delete', $idea);

        $this->ideaService->delete($idea);

        return response()->json([
            'message' => 'Idea deleted successfully'
        ]);
    }
}
