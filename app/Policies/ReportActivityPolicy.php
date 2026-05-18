<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ReportActivity;

class ReportActivityPolicy
{
    /**
     * Voir la liste des rapports
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un rapport — uniquement propriétaire du planning
     */
    public function view(User $user, ReportActivity $report): bool
    {
        return $user->iduser === $report->planning->iduser;
    }

    /**
     * Créer un rapport
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Modifier un rapport — uniquement propriétaire du planning
     */
    public function update(User $user, ReportActivity $report): bool
    {
        return $user->iduser === $report->planning->iduser;
    }

    /**
     * Supprimer un rapport — uniquement propriétaire du planning
     */
    public function delete(User $user, ReportActivity $report): bool
    {
        return $user->iduser === $report->planning->iduser;
    }
}
