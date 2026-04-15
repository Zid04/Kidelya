<?php

namespace App\Http\Requests\Idea;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation update idée
 */
class UpdateIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
         return auth()->check()
    && $user->IdUser === $group->IdUser;
      

    }

    public function rules(): array
    {
        return [
            'Title' => 'sometimes|string|max:150',
            'Notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'Title.string' => 'The title must be a string.',
        ];
    }
}