<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ReportActivity;

class ReportActivityPolicy
{
    // p
    public function viewAny(User $user): bool
    {
        return auth()->check() && $user->IdUser === $report->planning->IdUser;
    }
// pour la visualisation d'un rapport spécifique, on vérifie que l'utilisateur est connecté et qu'il est le propriétaire du rapport 
    public function view(User $user, ReportActivity $report): bool
    {
        return auth()->check() && $user->IdUser === $report->planning->IdUser;
    }
// pour la création d'un rapport, on vérifie simplement que l'utilisateur est connecté
    public function create(User $user): bool
    {
        return auth()->check();
    }
// pour update et delete, on vérifie que l'utilisateur est connecté et qu'il est le propriétaire du rapport
    public function update(User $user, ReportActivity $report): bool
    {
     
        return auth()->check() && $user->IdUser === $report->planning->IdUser;
    }

    public function delete(User $user, ReportActivity $report): bool
    {
        return auth()->check() && $user->IdUser === $report->planning->IdUser;
    }
}