<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddActivityToPlanningRequest extends FormRequest
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
            'activity_id' => 'required|exists:activities,IdActivities',
        ];
    }
//permet de personnaliser les messages d'erreur retournés en cas de validation échouée
    public function messages(): array
    {
        return [
            'activity_id.required' => 'Activity is required.',
            'activity_id.exists'   => 'Activity not found.',
        ];
    }
}