<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddGroupToPlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'group_id' => 'required|exists:groups,idgroup',
        ];
    }
}
