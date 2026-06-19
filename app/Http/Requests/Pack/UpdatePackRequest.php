<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('pack'));
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'tarification' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'is_published' => 'sometimes|boolean',
            'type' => 'sometimes|string|in:subscription_monthly,subscription_yearly,credit_pack,premium,trial',
            'illustration' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
            'illustration_url' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'Le titre doit être une chaîne.',
            'title.max' => 'Le titre ne peut pas dépasser 150 caractères.',
            'tarification.numeric' => 'Le prix doit être un nombre.',
            'tarification.min' => 'Le prix ne peut pas être négatif.',
            'duration.integer' => 'La durée doit être un entier.',
            'duration.min' => 'La durée doit être d\'au moins 1.',
        ];
    }
}
