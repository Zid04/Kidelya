<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildRequest extends FormRequest
{
    /**
     * Autorisation :
     * seul un utilisateur connecté peut créer un enfant
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Validation des données de création d'un enfant
     */
    public function rules(): array
    {
        return [
            'LastName'          => 'required|string|max:50',
            'FirstName'         => 'required|string|max:50',
            'BirthDay'          => 'required|date',
            'SpecificationNote' => 'nullable|string',
            'Sexe'              => 'required|in:M,F',
            'PhotoUrl'          => 'nullable|url',
        ];
    }
    /// Messages personnalisés pour les erreurs de validation
    
    public function messages(): array
{
    return [
        'LastName.required'  => 'The last name is required.',
        'FirstName.required' => 'The first name is required.',
        'BirthDay.required'  => 'The birth date is required.',
        'BirthDay.date'      => 'The birth date must be a valid date.',
        'Sexe.in'            => 'Sexe must be M or F.',
    ];
}
}