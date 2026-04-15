<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('activity'));
    }

    public function rules(): array
    {
        return [
            'Title'       => 'required|string|max:50',
            'Description' => 'nullable|string',
            'AgeMin'      => 'nullable|integer|min:2',
            'AgeMax'      => 'nullable|integer|min:0|gte:AgeMin',
            'Duration'    => 'nullable|integer|min:1',
            'Season'      => 'nullable|string|max:50',
            'Location'    => 'nullable|string|max:100',
            'PhotoUrl'    => 'nullable|url|max:255',
            'IdUser'      => 'required|exists:users,IdUser',
        ];
    }

    public function messages(): array
    {
        return [
            'Title.required' => 'The title is required.',
            'AgeMax.gte'     => 'The maximum age must be greater than or equal to the minimum age.',
            'IdUser.exists'  => 'The selected user does not exist.',
        ];
    }
}