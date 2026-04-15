<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation update Pack
 */
class UpdatePackRequest extends FormRequest
{
    /**
     * Autorisation :
     * seul le propriétaire peut modifier
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Règles update (partiel autorisé)
     */
    public function rules(): array
    {
        return [
            'Title'        => 'sometimes|string|max:150',
            'Description'  => 'nullable|string',
            'Tarification' => 'sometimes|numeric|min:0',
            'Duration'     => 'sometimes|integer|min:1',
        ];
    }

    /**
     * Messages d'erreur personnalisés
     */
    public function messages(): array
    {
        return [
            'Title.string'          => 'The title must be a string.',
            'Title.max'             => 'The title must not exceed 150 characters.',

            'Description.string'    => 'The description must be a valid text.',

            'Tarification.numeric'  => 'The price must be a number.',
            'Tarification.min'      => 'The price cannot be negative.',

            'Duration.integer'      => 'The duration must be an integer.',
            'Duration.min'          => 'The duration must be at least 1.',
        ];
    }
}