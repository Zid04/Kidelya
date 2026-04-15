<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChildRequest extends FormRequest
{
    /**
     * Vérifie si l'utilisateur a le droit de modifier cet enfant
     */
    public function authorize(): bool
    {
        return auth()->user()?->can('update', $this->route('child'));
    }

    /**
     * Validation update 
     */
    public function rules(): array
    {
        return [
            'LastName'          => 'sometimes|string|max:50',
            'FirstName'         => 'sometimes|string|max:50',
            'BirthDay'          => 'sometimes|date',
            'SpecificationNote' => 'nullable|string',
            'Sexe'              => 'sometimes|in:M,F',
            'PhotoUrl'          => 'nullable|url',
        ];
    }
    // Messages personnalisés pour les erreurs de validation
public function messages(): array
{
    return [
        'LastName.string'  => 'The last name must be a string.',
        'LastName.max'     => 'The last name must not exceed 50 characters.',

        'FirstName.string' => 'The first name must be a string.',
        'FirstName.max'    => 'The first name must not exceed 50 characters.',

        'BirthDay.date'    => 'The birth date must be a valid date.',

        'Sexe.in'          => 'Sexe must be either M or F.',
        'PhotoUrl.url'     => 'The photo URL must be a valid URL.',
    ];
}
}