<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Group::class);
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'children'    => 'nullable|array',
            'children.*'  => 'integer|exists:children,idchildren',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du groupe est obligatoire.',
            'name.max'      => 'Le nom ne peut pas dépasser 100 caractères.',
        ];
    }
}
