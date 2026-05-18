<?php

namespace App\Http\Requests\ReportActivity;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('reportactivity'));
    }

    public function rules(): array
    {
        return [
            'comments'     => 'sometimes|string',
            'photourl'     => 'nullable|url',
            'improvements' => 'nullable|string',
            'positive'     => 'nullable|string',
            'difficulties' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'photourl.url' => 'The PhotoUrl must be a valid URL.',
        ];
    }
}
