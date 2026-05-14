<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\User::class);
    }

    public function rules(): array
    {
        return [
            'firstname' => 'required|string|max:50',
            'lastname'  => 'required|string|max:50',
            'email'     => 'required|email|max:255|unique:users,email',
            'password'  => ['required', 'confirmed', Password::defaults()],
            'avatarurl' => 'nullable|url|max:255',
            'idrole'    => 'required|exists:roles,idrole',
        ];
    }

    public function messages(): array
    {
        return [
            'firstname.required' => 'The first name is required.',
            'lastname.required'  => 'The last name is required.',
            'email.required'     => 'The email address is required.',
            'email.unique'       => 'This email address is already in use.',
            'password.required'  => 'The password is required.',
            'password.confirmed' => 'The password confirmation does not match.',
            'idrole.exists'      => 'The selected role does not exist.',
        ];
    }
}
