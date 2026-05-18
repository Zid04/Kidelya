<?php

namespace App\Http\Requests\Guardian;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('guardian'));
    }

    public function rules(): array
    {
        $id = $this->route('guardian')->idparent;

        return [
            'names'   => 'sometimes|string|max:100',
            'email'   => "sometimes|email|unique:parents,email,{$id},idparent",
            'phone'   => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'email.email'  => 'Please provide a valid email address.',
            'email.unique' => 'This email is already used.',
        ];
    }
}
