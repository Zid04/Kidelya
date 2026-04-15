<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    /**
     * Autorisation :
     * utilisateur connecté uniquement
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Validation création groupe
     */
    public function rules(): array
    {
        return [
            'Name'        => 'required|string|max:100',
            'Description' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'Name.required' => 'Group name is required.',
            'Name.max'      => 'Group name must not exceed 100 characters.',
        ];
    }
}