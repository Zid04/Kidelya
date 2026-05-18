<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Activity::class);
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

            
            'credit_price'   => 'required|integer|min:0',
            'is_purchasable' => 'required|boolean',
            'is_published'   => 'required|boolean',

            'themes'         => 'nullable|array',
            'themes.*'       => 'integer|exists:themes,idtheme',

            'competences'    => 'nullable|array',
            'competences.*'  => 'integer|exists:competences,idcompetence',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'        => 'The title is required.',
            'agemax.gte'            => 'The maximum age must be greater than or equal to the minimum age.',
            'iduser.exists'         => 'The selected user does not exist.',
            'credit_price.required' => 'The credit price is required.',
        ];
    }
}
