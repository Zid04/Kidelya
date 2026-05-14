<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Child::class);
    }

    public function rules(): array
    {
        return [
            'lastname'          => 'required|string|max:50',
            'firstname'         => 'required|string|max:50',
            'birthday'          => 'required|date',
            'specificationnote' => 'nullable|string',
            'sexe'              => 'required|in:M,F',
            'photourl'          => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'lastname.required'  => 'The last name is required.',
            'firstname.required' => 'The first name is required.',
            'birthday.required'  => 'The birth date is required.',
            'birthday.date'      => 'The birth date must be a valid date.',
            'sexe.in'            => 'Sexe must be M or F.',
        ];
    }
}
