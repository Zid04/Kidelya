<?php

namespace App\Http\Controllers;

use App\Models\Competence;
use App\Services\CompetenceService;
use App\Http\Requests\Competence\StoreCompetenceRequest;
use App\Http\Requests\Competence\UpdateCompetenceRequest;
use Illuminate\Http\JsonResponse;

class CompetenceController extends Controller
{
    public function __construct(
        private CompetenceService $competenceService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Competence::class);

        return response()->json([
            'data' => $this->competenceService->getAll()
        ]);
    }

    public function store(StoreCompetenceRequest $request): JsonResponse
    {
        $this->authorize('create', Competence::class);

        return response()->json([
            'message' => 'Competence created successfully',
            'data'    => $this->competenceService->create($request->validated())
        ], 201);
    }

    public function show(Competence $competence): JsonResponse
    {
        $this->authorize('view', $competence);

        return response()->json([
            'data' => $competence->load('activities')
        ]);
    }

    public function update(UpdateCompetenceRequest $request, Competence $competence): JsonResponse
    {
        $this->authorize('update', $competence);

        return response()->json([
            'message' => 'Competence updated successfully',
            'data'    => $this->competenceService->update($competence, $request->validated())
        ]);
    }

    public function destroy(Competence $competence): JsonResponse
    {
        $this->authorize('delete', $competence);

        $this->competenceService->delete($competence);

        return response()->json([
            'message' => 'Competence deleted successfully'
        ]);
    }
}
