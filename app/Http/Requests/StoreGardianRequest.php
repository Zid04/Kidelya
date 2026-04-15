<?php

namespace App\Http\Requests\Guardian;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation création d'un parent / tuteur
 */
class StoreGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }
// Règles de validation pour la création d'un parent / tuteur

    public function rules(): array
    {
        return [
            'Names'   => 'required|string|max:100',
            'Email'   => 'required|email|unique:parents,Email',
            'Phone'   => 'nullable|string|max:30',
            'Address' => 'nullable|string|max:255',
        ];
    }
// Personnalisation des messages d'erreur 
    public function messages(): array
    {
        return [
            'Names.required' => 'The name is required.',
            'Email.required' => 'The email is required.',
            'Email.unique'   => 'This email is already used.',
        ];
    }
}