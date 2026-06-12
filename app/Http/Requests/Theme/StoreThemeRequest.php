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
            'name.required' => 'Le nom du thème est obligatoire.',
            'name.unique'   => 'Ce thème existe déjà.',
        ];
    }
}
