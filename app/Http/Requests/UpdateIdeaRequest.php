<?php

namespace App\Http\Requests\Idea;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('idea'));
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'The title must be a string.',
        ];
    }
}
