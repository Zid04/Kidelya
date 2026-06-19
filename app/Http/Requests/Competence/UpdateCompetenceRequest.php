<?php

namespace App\Http\Requests\Competence;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompetenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('competence'));
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100|unique:competences,name,'
                      .$this->route('competence')->idcompetence.',idcompetence',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Le nom doit être une chaîne.',
            'name.max' => 'Le nom ne doit pas dépasser 100 caractères.',
            'name.unique' => 'Cette compétence existe déjà.',
        ];
    }
}
