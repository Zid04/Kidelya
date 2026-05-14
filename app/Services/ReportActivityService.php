<?php

namespace App\Services;

use App\Models\ReportActivity;

class ReportActivityService
{
    /**
     * Créer un rapport d'activité
     */
    public function create(array $data): ReportActivity
    {
        return ReportActivity::create($data);
    }

    /**
     * Mettre à jour un rapport d'activité
     */
    public function update(ReportActivity $report, array $data): ReportActivity
    {
        $report->update($data);
        return $report->fresh();
    }

    /**
     * Supprimer un rapport d'activité
     */
    public function delete(ReportActivity $report): void
    {
        $report->delete();
    }

    /**
     * Récupérer tous les rapports d'activité
     */
    public function getAll()
    {
        return ReportActivity::with('planning')
            ->latest()
            ->get();
    }
}
