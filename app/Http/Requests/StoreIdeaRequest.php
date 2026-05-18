<?php

namespace App\Http\Requests\Idea;

use Illuminate\Foundation\Http\FormRequest;

class StoreIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Idea::class);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:150',
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
        ];
    }
}
