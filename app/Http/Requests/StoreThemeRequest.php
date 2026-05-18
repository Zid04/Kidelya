<?php

namespace App\Http\Requests\Theme;

use Illuminate\Foundation\Http\FormRequest;

class StoreThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Theme::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:themes,name',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The theme name is required.',
            'name.unique'   => 'This theme already exists.',
        ];
    }
}
