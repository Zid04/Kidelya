<?php

namespace App\Policies;

use App\Models\User;

/**
 * Policy de gestion des autorisations pour le modèle User.
 *
 * Logique métier :
 * - Admin : supervise (lecture globale)
 * - User : autonome (gère son propre compte)
 */
class UserPolicy
{
    /**
     * Voir la liste de tous les utilisateurs
    * réservé à l’Admin
     */
    public function viewAny(User $user): bool
    {
        return $user->role->Type === 'Admin';
    }

    /**
     * Voir un profil
     * soi-même OU admin
     */
    public function view(User $user, User $model): bool
    {
        return $user->IdUser === $model->IdUser
            || $user->role->Type === 'Admin';
    }

    /**
     * Création d’un utilisateur
     * inscription public
     */
    public function create(?User $user = null): bool
    {
        return true;
    }

    /**
     * Modifier un profil
     * soi-même 
     */
    public function update(User $user, User $model): bool
    {
        return $user->IdUser === $model->IdUser
            || $user->role->Type === 'Admin';
    }

    /**
     * Suppression (ou désactivation)
     *  soi-même
     */
    public function delete(User $user, User $model): bool
    {
        return $user->IdUser === $model->IdUser;
    }
}