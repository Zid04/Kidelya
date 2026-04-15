<?php

namespace App\Http\Requests\ReportActivity;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportActivityRequest extends FormRequest
{
    // autorisation pour la mise à jour d'un rapport d'activité
    public function authorize(): bool
    {
        return auth()->check();
    }
// règles de validation pour la mise à jour d'un rapport d'activité
    public function rules(): array
    {
        return [
            'Comments'     => 'sometimes|string',
            'PhotoUrl'     => 'nullable|url',
            'Improvements' => 'nullable|string',
            'Positive'     => 'nullable|string',
            'Difficulties' => 'nullable|string',
        ];
    }
    // messages personnalisés pour les erreurs de validation
    public function messages(): array
    {
        return [

            'PhotoUrl.url' => 'The PhotoUrl must be a valid URL.',
            
        ]; 
        }
    
}