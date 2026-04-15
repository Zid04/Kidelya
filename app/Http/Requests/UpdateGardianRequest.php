<?php

namespace App\Http\Requests\Guardian;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation mise à jour parent / tuteur
 */
class UpdateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }
// Règles de validation pour la mise à jour d'un parent / tuteur
    public function rules(): array
    {
        return [
            'Names'   => 'sometimes|string|max:100',
            'Email'   => 'sometimes|email|unique:parents,Email,' . $this->route('guardian')->IdParent . ',IdParent',
            'Phone'   => 'nullable|string|max:30',
            'Address' => 'nullable|string|max:255',
        ];
    }
// Personnalisation des messages d'erreur
    public function messages(): array
    {
        return [
            'Email.email' => 'Please provide a valid email address.',
            'Email.unique' => 'This email is already used.',
        ];
    }
}