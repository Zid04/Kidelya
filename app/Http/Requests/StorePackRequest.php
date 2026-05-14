<?php

namespace App\Http\Requests\Pack;

use Illuminate\Foundation\Http\FormRequest;

class StorePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Pack::class);
    }

    public function rules(): array
    {
        return [
            'title'        => 'required|string|max:150',
            'description'  => 'nullable|string',
            'tarification' => 'required|numeric|min:0',
            'duration'     => 'required|integer|min:1',

            'is_published' => 'required|boolean',
            'type'         => 'required|string|in:subscription_monthly,subscription_yearly,credit_pack,premium,trial',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'        => 'The title is required.',
            'tarification.required' => 'The price is required.',
            'duration.required'     => 'The duration is required.',
            'type.required'         => 'The pack type is required.',
        ];
    }
}
