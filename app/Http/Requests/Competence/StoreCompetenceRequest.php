<?php

namespace App\Http\Requests\Competence;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompetenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Competence::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:competences,name',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la compétence est obligatoire.',
            'name.unique'   => 'Cette compétence existe déjà.',
            'name.max'      => 'Le nom ne doit pas dépasser 100 caractères.',
        ];
    }
}
