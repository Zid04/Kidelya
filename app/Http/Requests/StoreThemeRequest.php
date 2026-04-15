<?php

namespace App\Http\Requests\Theme;

use Illuminate\Foundation\Http\FormRequest;

class StoreThemeRequest extends FormRequest
{
    //determine si l'utilisateur est autorisé à faire cette requete
    public function authorize(): bool
    {
        return auth()->check();
    }

    //les regles de validation pour les champs du formulaire

    public function rules(): array
    {
        return [
            'Name' => 'required|string|max:100|unique:themes,Name',
        ];
    }
//les messages d'erreur personnalisés pour les règles de validation
    public function messages(): array
    {
        return [
            'Name.required' => 'The theme name is required.',
            'Name.unique'   => 'This theme already exists.',
        ];
    }
}