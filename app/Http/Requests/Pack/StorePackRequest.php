<?php

namespace App\Http\Requests\Pack;

use App\Models\Pack;
use Illuminate\Foundation\Http\FormRequest;

class StorePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Pack::class);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'tarification' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'is_published' => 'required|boolean',
            'type' => 'required|string|in:subscription_monthly,subscription_yearly,credit_pack,premium,trial',
            'illustration' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
            'illustration_url' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'tarification.required' => 'Le prix est obligatoire.',
            'duration.required' => 'La durée est obligatoire.',
            'type.required' => 'Le type de pack est obligatoire.',
        ];
    }
}
