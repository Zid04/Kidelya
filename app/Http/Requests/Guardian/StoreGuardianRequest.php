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
            'names.required' => 'Le nom est requis.',
            'email.required' => "L'email est requis.",
            'email.unique'   => 'Cet email est déjà utilisé.',
        ];
    }
}
