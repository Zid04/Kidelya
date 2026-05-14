<?php

namespace App\Http\Requests\Guardian;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Guardian::class);
    }

    public function rules(): array
    {
        return [
            'names'   => 'required|string|max:100',
            'email'   => 'required|email|unique:parents,email',
            'phone'   => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'names.required' => 'The name is required.',
            'email.required' => 'The email is required.',
            'email.unique'   => 'This email is already used.',
        ];
    }
}
