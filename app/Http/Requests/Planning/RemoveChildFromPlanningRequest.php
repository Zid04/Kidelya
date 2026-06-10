<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class RemoveChildFromPlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'child_id' => 'required|exists:children,idchildren',
        ];
    }
}
