<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('group'));
    }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Le nom doit être une chaîne.',
            'name.max'    => 'Le nom ne peut pas dépasser 100 caractères.',
        ];
    }
}
