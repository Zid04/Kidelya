<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Voir la liste de tous les utilisateurs
     * Réservé à l’Admin
     */
    public function viewAny(User $user): bool
    {
        return $user->role->type === 'Admin';
    }

    /**
     * Voir un profil
     * - soi-même
     * - ou admin
     */
    public function view(User $user, User $model): bool
    {
        return $user->iduser === $model->iduser
            || $user->role->type === 'Admin';
    }

    /**
     * Création d’un utilisateur
     * Inscription publique → pas besoin d’être connecté
     */
    public function create(?User $user = null): bool
    {
        return true;
    }

    /**
     * Modifier un profil
     * - soi-même
     * - ou admin
     */
    public function update(User $user, User $model): bool
    {
        return $user->iduser === $model->iduser
            || $user->role->type === 'Admin';
    }

    /**
     * Suppression (ou désactivation)
     * - uniquement soi-même
     * (un admin ne peut pas supprimer un autre compte ici)
     */
    public function delete(User $user, User $model): bool
    {
        return $user->iduser === $model->iduser;
    }
}
