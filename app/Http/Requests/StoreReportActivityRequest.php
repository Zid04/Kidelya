<?php

namespace App\Http\Requests\ReportActivity;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\ReportActivity::class);
    }

    public function rules(): array
    {
        return [
            'comments'     => 'nullable|string',
            'photourl'     => 'nullable|url',
            'improvements' => 'nullable|string',
            'positive'     => 'nullable|string',
            'difficulties' => 'nullable|string',
            'idplanning'   => 'required|exists:plannings,idplanning',
        ];
    }

    public function messages(): array
    {
        return [
            'idplanning.required' => 'Planning is required.',
            'idplanning.exists'   => 'Planning not found.',
        ];
    }
}
