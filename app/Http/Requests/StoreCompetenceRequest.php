<?php

namespace App\Http\Requests\Competence;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompetenceRequest extends FormRequest
{
    
    public function authorize(): bool
    {
         return auth()->check();
    }

    /**
     * Validation création compétence
     */
    public function rules(): array
    {
        return [
            'Name' => 'required|string|max:100|unique:competences,Name',
        ];
    }
    /**
     * Messages personnalisés 
     */
    public function messages(): array
    {
        return [
            'Name.required' => 'Le nom de la compétence est obligatoire.',
            'Name.unique'   => 'Cette compétence existe déjà.',
            'Name.max'      => 'Le nom ne doit pas dépasser 100 caractères.',
            'Name.unique'   => 'This competence already exists.',
        ];
    }
}