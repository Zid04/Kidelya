<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

/**
 * Requête de validation pour la mise à jour d'un utilisateur.
 *
 * Le mot de passe est optionnel lors d'une mise à jour —
 * on ne le modifie que s'il est explicitement fourni.
 */
class UpdateUserRequest extends FormRequest
{
    /**
     * Vérifie si l'utilisateur peut modifier CE profil.
     * La logique fine est déléguée à UserPolicy.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    /**
     * Règles de validation pour la mise à jour.
     * - Email unique 
     * - Password optionnel 
     */
    public function rules(): array
    {
        $userId = $this->route('user')->IdUser;

        return [
            'FirstName' => 'required|string|max:50',
            'LastName'  => 'required|string|max:50',
            'Email'     => "required|email|max:255|unique:users,Email,{$userId},IdUser",
            'Password'  => ['nullable', 'confirmed', Password::defaults()],
            'AvatarUrl' => 'nullable|url|max:2048',
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
            'IdRole.exists'      => 'The selected role does not exist.',
        ];
    }
}