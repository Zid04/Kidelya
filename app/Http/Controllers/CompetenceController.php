<?php

namespace App\Http\Controllers;

use App\Models\Competence;
use App\Services\CompetenceService;
use App\Http\Requests\Competence\StoreCompetenceRequest;
use App\Http\Requests\Competence\UpdateCompetenceRequest;


class CompetenceController extends Controller
{
    public function __construct(
        private CompetenceService $competenceService
    ) {}

    /**
     * Liste des compétences
     */
    public function index()
    {
        $this->authorize('viewAny', Competence::class);

        return $this->competenceService->getAll();
    }

    /**
     * Création
     */
    public function store(StoreCompetenceRequest $request)
    {
        $this->authorize('create', Competence::class);

        return $this->competenceService->create($request->validated());
    }

    /**
     * Détails
     */
    public function show(Competence $competence)
    {
        $this->authorize('view', $competence);

        return $competence->load('activities');
    }

    /**
     * Mise à jour
     */
    public function update(UpdateCompetenceRequest $request, Competence $competence)
    {
        $this->authorize('update', $competence);

        return $this->competenceService->update($competence, $request->validated());
    }

    /**
     * Suppression
     */
    public function destroy(Competence $competence)
    {
        $this->authorize('delete', $competence);

        $this->competenceService->delete($competence);

        return response()->json([
            'message' => 'Competence deleted successfully'
        ]);
    }
}