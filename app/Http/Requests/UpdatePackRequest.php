<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('pack'));
    }

    public function rules(): array
    {
        return [
            'title'        => 'sometimes|string|max:150',
            'description'  => 'nullable|string',
            'tarification' => 'sometimes|numeric|min:0',
            'duration'     => 'sometimes|integer|min:1',

            'is_published' => 'sometimes|boolean',
            'type'         => 'sometimes|string|in:subscription_monthly,subscription_yearly,credit_pack,premium,trial',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string'          => 'The title must be a string.',
            'title.max'             => 'The title must not exceed 150 characters.',

            'tarification.numeric'  => 'The price must be a number.',
            'tarification.min'      => 'The price cannot be negative.',

            'duration.integer'      => 'The duration must be an integer.',
            'duration.min'          => 'The duration must be at least 1.',
        ];
    }
}
