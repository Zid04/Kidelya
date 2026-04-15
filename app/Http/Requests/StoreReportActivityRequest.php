<?php

namespace App\Http\Requests\ReportActivity;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportActivityRequest extends FormRequest
{
    // autorisation pour la création d'un rapport d'activité
    public function authorize(): bool
    {
        return auth()->check();
    }
// règles de validation pour la création d'un rapport d'activité
    public function rules(): array
    {
        return [
            'Comments'     => 'nullable|string',
            'PhotoUrl'     => 'nullable|url',
            'Improvements' => 'nullable|string',
            'Positive'     => 'nullable|string',
            'Difficulties' => 'nullable|string',
            'planning_id'  => 'required|exists:plannings,IdPlanning',
        ];
    }
// messages personnalisés pour les erreurs de validation
    public function messages(): array
    {
        return [
            'planning_id.required' => 'Planning is required.',
            'planning_id.exists'   => 'Planning not found.',
        ];
    }
}