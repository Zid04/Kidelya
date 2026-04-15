<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddChildToPlanningRequest extends FormRequest
{
    //permet de vérifier que l'utilisateur est authentifié avant de traiter la requête
    public function authorize(): bool
    {
        return auth()->check();
    }
//permet de définir les règles de validation pour les données envoyées dans la requête
    public function rules(): array
    {
        return [
            'child_id' => 'required|exists:children,IdChildren',
        ];
    }
//permet de personnaliser les messages d'erreur retournés en cas de validation échouée
    public function messages(): array
    {
        return [
            'child_id.required' => 'Child is required.',
            'child_id.exists'   => 'Child not found.',
        ];
    }
}