<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation ajout activité dans pack
 */
class AddActivityToPackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required|exists:activities,IdActivities',
        ];
    }

    public function messages(): array
    {
        return [
            'activity_id.required' => 'The activity is required.',
            'activity_id.exists'   => 'The selected activity does not exist.',
        ];
    }
}