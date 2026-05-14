<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddGroupToPlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('attachChild', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'group_id' => 'required|exists:groups,idgroup',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id.required' => 'Group is required.',
            'group_id.exists'   => 'Group not found.',
        ];
    }
}
