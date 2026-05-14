<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('child'));
    }

    public function rules(): array
    {
        return [
            'lastname'          => 'sometimes|string|max:50',
            'firstname'         => 'sometimes|string|max:50',
            'birthday'          => 'sometimes|date',
            'specificationnote' => 'nullable|string',
            'sexe'              => 'sometimes|in:M,F',
            'photourl'          => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'lastname.string'  => 'The last name must be a string.',
            'lastname.max'     => 'The last name must not exceed 50 characters.',

            'firstname.string' => 'The first name must be a string.',
            'firstname.max'    => 'The first name must not exceed 50 characters.',

            'birthday.date'    => 'The birth date must be a valid date.',

            'sexe.in'          => 'Sexe must be either M or F.',
            'photourl.url'     => 'The photo URL must be a valid URL.',
        ];
    }
}
