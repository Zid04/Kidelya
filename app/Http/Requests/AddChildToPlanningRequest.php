<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddChildToPlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('attachChild', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'child_id' => 'required|exists:children,idchildren',
        ];
    }

    public function messages(): array
    {
        return [
            'child_id.required' => 'Child is required.',
            'child_id.exists'   => 'Child not found.',
        ];
    }
}
