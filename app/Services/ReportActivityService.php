<?php

namespace App\Services;

use App\Models\ReportActivity;

class ReportActivityService
{
    //permet de créer un rapport d'activité

    public function create(array $data): ReportActivity
    {
        return ReportActivity::create($data);
    }
//permet de mettre à jour un rapport d'activité
    public function update(ReportActivity $report, array $data): ReportActivity
    {
        $report->update($data);

        return $report->fresh();
    }
//permet de supprimer un rapport d'activité
    public function delete(ReportActivity $report): void
    {
        $report->delete();
    }
}