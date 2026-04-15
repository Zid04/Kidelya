<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation création Pack
 */
class StorePackRequest extends FormRequest
{
    /**
     * Autorisation :
     * tout utilisateur connecté peut créer un pack (Partner / Admin)
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Règles de validation
     */
    public function rules(): array
    {
        return [
            'Title'        => 'required|string|max:150',
            'Description'  => 'nullable|string',
            'Tarification' => 'required|numeric|min:0',
            'Duration'     => 'required|integer|min:1',
        ];
    }

    /**
     * Messages d'erreur personnalisés
     */
    public function messages(): array
    {
        return [
            'Title.required'        => 'The title is required.',
            'Title.string'          => 'The title must be a string.',
            'Title.max'             => 'The title must not exceed 150 characters.',

            'Description.string'    => 'The description must be a valid text.',

            'Tarification.required'  => 'The price is required.',
            'Tarification.numeric'   => 'The price must be a number.',
            'Tarification.min'      => 'The price must be at least 0.',

            'Duration.required'      => 'The duration is required.',
            'Duration.integer'       => 'The duration must be an integer.',
            'Duration.min'           => 'The duration must be at least 1.',
        ];
    }
}