<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Validation rules for user profile fields.
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'firstname' => $this->firstnameRules(),
            'lastname'  => $this->lastnameRules(),
            'email'     => $this->emailRules($userId),
            'avatarurl' => $this->avatarRules(),
        ];
    }

    protected function firstnameRules(): array
    {
        return ['required', 'string', 'max:50'];
    }

    protected function lastnameRules(): array
    {
        return ['required', 'string', 'max:50'];
    }

    protected function avatarRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }

    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class, 'email')
                : Rule::unique(User::class, 'email')->ignore($userId, 'iduser'),
        ];
    }
}
