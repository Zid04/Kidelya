<?php

namespace App\Http\Requests\Theme;

use Illuminate\Foundation\Http\FormRequest;

class UpdateThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('theme'));
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100|unique:themes,name,' . $this->route('theme')->idtheme . ',idtheme',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'The theme name must be a string.',
            'name.unique' => 'This theme already exists.',
        ];
    }
}
