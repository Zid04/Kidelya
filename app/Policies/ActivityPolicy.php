<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

/**
 * Policy de gestion des autorisations pour le modèle Activity.
 *
 * Centralisée ici pour éviter de disperser la logique
 * d'autorisation dans les controllers ou les services.
 * 
 * Enregistrée dans AppServiceProvider via Gate::policy().
 */

class ActivityPolicy
{
    /**
     * Voir la liste des activités.
     */
    public function viewAny(User $user): bool
    {
         // tous les utilisateurs connectés
        return true;
    }

    /**
     * Voir une activité.
     */
    public function view(User $user, Activity $activity): bool
    {
        return true;
    }

    /**
     * Créer une activité.
     */
    public function create(User $user): bool
    {
        // affinez selon les rôles
        return true; 
    }

    /**
     * Modifier une activité — uniquement son propriétaire.
     */
    public function update(User $user, Activity $activity): bool
    {
        return $user->IdUser === $activity->IdUser;
    }

    /**
     * Supprimer une activité — uniquement son propriétaire.
     */
    public function delete(User $user, Activity $activity): bool
    {
        return $user->IdUser === $activity->IdUser;
    }
}