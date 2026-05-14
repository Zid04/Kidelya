<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Planning::class);
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.string'   => 'The title must be a string.',
            'title.max'      => 'The title must not exceed 150 characters.',
        ];
    }
}
