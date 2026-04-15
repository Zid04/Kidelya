<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Services\ActivityService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Controller de gestion des activités.
 *
 * Suit le principe de responsabilité unique (SRP) :
 * - La validation est déléguée aux Form Requests
 * - La logique métier est déléguée à ActivityService
 * - Les autorisations sont gérées par ActivityPolicy
 *
 * Ce controller ne fait qu'orchestrer et retourner des réponses Inertia.
 */
class ActivityController extends Controller
{
    /**
     * Injection du service via le constructeur.
      * Cela permet de centraliser la logique métier dans ActivityService
      * et de garder le controller léger et facile à maintenir.
     */
    public function __construct(
        private readonly ActivityService $activityService
    ) {}

    /**
     * Affiche la liste paginée des activités.
     */
    public function index(Request $request): Response
    {
        // Validation légère des filtres entrants
        $request->validate([
            'age'           => 'nullable|integer|min:0',
            'season'        => 'nullable|string|max:50',
            'themes'        => 'nullable|array',
            'themes.*'      => 'integer|exists:themes,IdTheme',
            'competences'   => 'nullable|array',
            'competences.*' => 'integer|exists:competences,IdCompetence',
        ]);

        // Extraction des filtres depuis la requête
        $filters = $request->only(['age', 'season', 'themes', 'competences']);

        return Inertia::render('Activities/Index', [
            'activities' => $this->activityService->getPaginated($filters),
            'filters'    => $filters, // Renvoyé au front pour pré-remplir les champs de recherche
        ]);
    }

    /**
     * Affiche le formulaire de création d'une activité.
     * Pas de logique ici — on se contente de rendre la vue.
     */
    public function create(): Response
    {
        return Inertia::render('Activities/Create');
    }

    /**
     * Enregistre une nouvelle activité.
     *
     * La validation et l'autorisation sont gérées par StoreActivityRequest
     * avant même d'entrer dans cette méthode.
     */
    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $this->activityService->create($request->validated());

        return redirect()->route('activities.index')
            ->with('success', 'Activity created successfully.');
    }

    /**
     * Affiche le détail d'une activité.
     * On charge les relations nécessaires à la vue via eager loading.
     */
    public function show(Activity $activity): Response
    {
        // Chargement des relations pour éviter le N+1 dans la vue
        $activity->load(['user', 'themes', 'competences', 'plannings', 'packs']);

        return Inertia::render('Activities/Show', [
            'activity' => $activity,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'une activité.
     * On précharge les relations pour pré-remplir le formulaire React.
     */
    public function edit(Activity $activity): Response
    {
        $activity->load(['user', 'themes', 'competences', 'plannings', 'packs']);

        return Inertia::render('Activities/Edit', [
            'activity' => $activity,
        ]);
    }

    /**
     * Met à jour une activité existante.
     *
     * La validation et l'autorisation sont gérées par UpdateActivityRequest
     * avant même d'entrer dans cette méthode.
     */
    public function update(UpdateActivityRequest $request, Activity $activity): RedirectResponse
    {
        $this->activityService->update($activity, $request->validated());

        return redirect()->route('activities.index')
            ->with('success', 'Activity updated successfully.');
    }

    /**
     * Supprime une activité.
     *
     * L'autorisation est vérifiée explicitement ici via $this->authorize()
     * car destroy() n'a pas de Form Request dédié.
     */
    public function destroy(Activity $activity): RedirectResponse
    {
        // Vérifie que l'utilisateur connecté est bien le propriétaire
        $this->authorize('delete', $activity);

        $this->activityService->delete($activity);

        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully.');
    }
}