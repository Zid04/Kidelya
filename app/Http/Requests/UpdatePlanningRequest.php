<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanningRequest extends FormRequest
{
    //permet de vérifier si l'utilisateur est autorisé à effectuer cette action
    public function authorize(): bool
    {
        return auth()->check();
    }
//permet de valider les données d'une planification avant de les mettre à jour dans la base de données
    public function rules(): array
    {
        return [
            'Title'       => 'sometimes|string|max:150',
            'Description' => 'nullable|string',
            'Location'    => 'nullable|string|max:255',
        ];
    }
//permet de personnaliser les messages d'erreur pour les règles de validation
    public function messages(): array
    {
        return [
            'Title.string' => 'The title must be a string.',
            'Title.max'    => 'The title must not exceed 150 characters.',
        ];
    }
}