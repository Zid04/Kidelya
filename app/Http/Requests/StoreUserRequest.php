<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

/**
 * Requête de validation pour la création d'un utilisateur.
 *
 * Gère l'autorisation et les règles de validation
 * avant que les données n'atteignent le controller.
 */
class StoreUserRequest extends FormRequest
{
    /**
     * Seul un Admin peut créer un utilisateur.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\User::class);
    }

    /**
     * Règles de validation pour la création.
     *
     * - Email doit être unique dans la table users
     * - Password suit les règles définies dans AppServiceProvider
     * - IdRole doit exister dans la table roles
     */
    public function rules(): array
    {
        return [
            'FirstName' => 'required|string|max:50',
            'LastName'  => 'required|string|max:50',
            'Email'     => 'required|email|max:255|unique:users,Email',
            'Password'  => ['required', 'confirmed', Password::defaults()],
            'AvatarUrl' => 'nullable|url|max:255',
            'IdRole'    => 'required|exists:roles,IdRole',
        ];
    }

    /**
     * Messages d'erreur personnalisés en anglais.
     */
    public function messages(): array
    {
        return [
            'FirstName.required' => 'The first name is required.',
            'LastName.required'  => 'The last name is required.',
            'Email.required'     => 'The email address is required.',
            'Email.unique'       => 'This email address is already in use.',
            'Password.required'  => 'The password is required.',
            'Password.confirmed' => 'The password confirmation does not match.',
            'IdRole.exists'      => 'The selected role does not exist.',
        ];
    }
}