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
            'date'        => 'required|date',
            'start_time'  => 'nullable|string',
            'end_time'    => 'nullable|string',
            'idchild'     => 'nullable|exists:children,idchildren',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis.',
            'date.required'  => 'La date est requise.',
        ];
    }
}
