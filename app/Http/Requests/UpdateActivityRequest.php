<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('activity'));
    }

    public function rules(): array
    {
        return [
            'title'          => 'required|string|max:50',
            'description'    => 'nullable|string',
            'agemin'         => 'nullable|integer|min:2',
            'agemax'         => 'nullable|integer|min:0|gte:agemin',
            'duration'       => 'nullable|integer|min:1',
            'season'         => 'nullable|string|max:50',
            'location'       => 'nullable|string|max:100',
            'photourl'       => 'nullable|url|max:255',
            'iduser'         => 'required|exists:users,iduser',

           
            'credit_price'   => 'sometimes|integer|min:0',
            'is_purchasable' => 'sometimes|boolean',
            'is_published'   => 'sometimes|boolean',

            'themes'         => 'nullable|array',
            'themes.*'       => 'integer|exists:themes,idtheme',

            'competences'    => 'nullable|array',
            'competences.*'  => 'integer|exists:competences,idcompetence',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'agemax.gte'     => 'The maximum age must be greater than or equal to the minimum age.',
            'iduser.exists'  => 'The selected user does not exist.',
        ];
    }
}
