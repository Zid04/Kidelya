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
                      . $this->route('competence')->idcompetence . ',idcompetence',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'The competence name must be a valid text.',
            'name.max'    => 'The competence name must not exceed 100 characters.',
            'name.unique' => 'This competence already exists.',
        ];
    }
}
