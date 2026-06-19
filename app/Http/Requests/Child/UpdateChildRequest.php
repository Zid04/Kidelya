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
            'lastname' => 'sometimes|string|max:50',
            'firstname' => 'sometimes|string|max:50',
            'birthday' => 'sometimes|date',
            'specification_note' => 'nullable|string',
            'sexe' => 'sometimes|in:male,female,other',
            'photourl' => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'lastname.string' => 'Le nom doit être une chaîne de caractères.',
            'lastname.max' => 'Le nom ne doit pas dépasser 50 caractères.',
            'firstname.string' => 'Le prénom doit être une chaîne de caractères.',
            'firstname.max' => 'Le prénom ne doit pas dépasser 50 caractères.',
            'birthday.date' => 'La date de naissance doit être valide.',
            'sexe.in' => 'Le sexe doit être M ou F.',
            'photourl.url' => 'L\'URL de la photo doit être une URL valide.',
        ];
    }
}
