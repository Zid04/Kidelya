<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'date' => 'sometimes|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'idchild' => 'nullable|exists:children,idchildren',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
        ];
    }
}
