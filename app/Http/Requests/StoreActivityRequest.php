<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour la création d'une activité.
 * 
 * Gère l'autorisation et les règles de validation
 * avant que les données n'atteignent le controller.
 */
class StoreActivityRequest extends FormRequest
{
    /**
     * Vérifie si l'utilisateur est autorisé à créer une activité.
     * La logique fine est déléguée à ActivityPolicy.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Activity::class);
    }

    /**
     * Règles de validation appliquées aux données entrantes.
     * 
     * - AgeMax doit être >= AgeMin grâce à la règle `gte`
     * - PhotoUrl doit être une URL valide si renseignée
     * - IdUser doit exister dans la table users
     */
    public function rules(): array
    {
        return [
            'Title'       => 'required|string|max:50',
            'Description' => 'nullable|string',
            'AgeMin'      => 'nullable|integer|min:2',
            'AgeMax'      => 'nullable|integer|min:0|gte:AgeMin',
            'Duration'    => 'nullable|integer|min:1',
            'Season'      => 'nullable|string|max:50',
            'Location'    => 'nullable|string|max:100',
            'PhotoUrl'    => 'nullable|url|max:255',
            'IdUser'      => 'required|exists:users,IdUser',
        ];
    }
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

        $filters = $request->only(['age', 'season', 'themes', 'competences']);

        return Inertia::render('Activities/Index', [
            'activities' => $this->activityService->getPaginated($filters),
            'filters'    => $filters,
        ]);
    }

    /**
     * Messages d'erreur personnalisés pour les règles de validation.
     * et pour une meilleure expérience utilisateur.
     */
    public function messages(): array
    {
        return [
            'Title.required' => 'The title is required.',
            'AgeMax.gte'     => 'The maximum age must be greater than or equal to the minimum age.',
            'IdUser.exists'  => 'The selected user does not exist.',
        ];
    }
}