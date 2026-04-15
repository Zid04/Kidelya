<?php

namespace App\Http\Requests\Idea;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation création idée
 */
class StoreIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }
//   permet de valider les données d'une idée avant de la stocker dans la base de données
    public function rules(): array
    {
        return [
            'Title' => 'required|string|max:150',
            'Notes' => 'nullable|string',
        ];
    }
//   permet de personnaliser les messages d'erreur de validation pour les règles définies 
    public function messages(): array
    {
        return [
            'Title.required' => 'The title is required.',
        ];
    }
}