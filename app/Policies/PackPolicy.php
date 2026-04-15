<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Pack;

/**
 * Policy Pack
 *
 * Règle métier :
 * - Admin : voit tout
 * - Partner : gère ses packs
 * - User : accès via abonnement (géré dans service)
 */
class PackPolicy
{
    public function viewAny(User $user): bool
    {
        return auth()->check();
    }

    /**
     * Admin + Partner + User peuvent voir,
     * filtrage réel fait dans le Service
     */
    public function view(User $user, Pack $pack): bool
    {
        return auth()->check();
    }

    /**
     * Admin + Partner peuvent créer
     */
    public function create(User $user): bool
    {
        return auth()->check();
    }

    /**
     * Seul le créateur peut modifier
     */
    public function update(User $user, Pack $pack): bool
    {
        return auth()->check() && $user->IdUser === $pack->CreatedBy;
    }

    /**
     * Seul le créateur peut supprimer
     */
    public function delete(User $user, Pack $pack): bool
    {
        return auth()->check() && $user->IdUser === $pack->CreatedBy;
    }
}