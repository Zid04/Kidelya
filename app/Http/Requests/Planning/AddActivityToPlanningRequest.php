<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class AddActivityToPlanningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('planning'));
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required|exists:activities,idactivities',
        ];
    }
}
