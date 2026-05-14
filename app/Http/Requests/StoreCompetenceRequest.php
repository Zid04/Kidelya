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
            'name.required' => 'The competence name is required.',
            'name.unique'   => 'This competence already exists.',
            'name.max'      => 'The competence name must not exceed 100 characters.',
        ];
    }
}
