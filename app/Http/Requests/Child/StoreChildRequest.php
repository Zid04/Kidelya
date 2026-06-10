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
            'specification_note' => 'nullable|string',
            'sexe'              => 'required|in:male,female,other',
            'photourl'          => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'lastname.required'  => 'Le nom de famille est requis.',
            'firstname.required' => 'Le prénom est requis.',
            'birthday.required'  => 'La date de naissance est requise.',
            'birthday.date'      => 'La date de naissance doit être une date valide.',
            'sexe.required'      => 'Le sexe est requis.',
            'sexe.in'            => 'Le sexe doit être M ou F.',
        ];
    }
}
