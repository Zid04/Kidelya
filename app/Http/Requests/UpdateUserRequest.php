<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    public function rules(): array
    {
        $userId = $this->route('user')->iduser;

        return [
            'firstname' => 'required|string|max:50',
            'lastname'  => 'required|string|max:50',
            'email'     => "required|email|max:255|unique:users,email,{$userId},iduser",
            'password'  => ['nullable', 'confirmed', Password::defaults()],
            'avatarurl' => 'nullable|url|max:2048',
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
            'idrole.exists'      => 'The selected role does not exist.',
        ];
    }
}
