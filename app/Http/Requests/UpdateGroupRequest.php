<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    // Autorisation : utilisateur connecté uniquement
    public function authorize(): bool
    {
        return auth()->check();
    }
// Validation mise à jour groupe
    public function rules(): array
    {
        return [
            'Name'        => 'sometimes|string|max:100',
            'Description' => 'nullable|string|max:255',
        ];
    }
    // Messages d'erreur personnalisés

    public function messages(): array
    {
        return [
            'Name.string' => 'Group name must be a valid text.',
            'Name.max'    => 'Group name must not exceed 100 characters.',
        ];
    }
}