<?php

namespace App\Http\Requests\Competence;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation pour la mise à jour d'une compétence
 */
class UpdateCompetenceRequest extends FormRequest
{
    /**
     * Autorisation :
     * utilisateur connecté requis
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Règles de validation
     */
    public function rules(): array
    {
        return [
            'Name' => 'sometimes|string|max:100|unique:competences,Name',
        ];
    }

    /**
     * Messages d'erreur personnalisés
     */
    public function messages(): array
    {
        return [
            'Name.string' => 'The competence name must be a valid text.',
            'Name.max'    => 'The competence name must not exceed 100 characters.',
            'Name.unique' => 'This competence already exists.',
        ];
    }
}