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
            'photo'          => 'nullable|image|max:5120',
            'photo_url'      => 'nullable|string|max:500',
            'steps'               => 'nullable|array',
            'steps.*.text'        => 'required|string|max:1000',
            'steps.*.image'       => 'nullable|image|max:5120',
            'steps.*.image_url'   => 'nullable|string|max:500',
            'category'       => 'nullable|string|max:50',
            'difficulty'     => 'nullable|in:facile,moyen,difficile',
            'materials'      => 'nullable|array',
            'materials.*'    => 'string|max:500',
            'credit_price'   => 'nullable|integer|min:0',
            'is_purchasable' => 'nullable|boolean',
            'is_published'   => 'nullable|boolean',

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
