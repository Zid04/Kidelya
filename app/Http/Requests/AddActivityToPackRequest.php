<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

class AddActivityToPackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('pack'));
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required|exists:activities,idactivities',
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
