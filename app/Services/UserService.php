<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Liste paginée des utilisateurs
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return User::with(['role'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Création d’un utilisateur
     */
    public function create(array $data): User
    {
        // Hash du mot de passe
        if (!empty($data['Password'])) {
            $data['Password'] = Hash::make($data['Password']);
        }

        // Valeur par défaut (optionnel)
        $data['is_active'] = true;

        return User::create($data);
    }

    /**
     * Mise à jour utilisateur
     */
    public function update(User $user, array $data): User
    {
        // Gestion mot de passe
        if (!empty($data['Password'])) {
            $data['Password'] = Hash::make($data['Password']);
        } else {
            unset($data['Password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    /**
     * Désactivation d’un utilisateur (soft delete)
     */
    public function deactivate(User $user): User
    {
        $user->update([
            'is_active' => false
        ]);

        $user->fresh();
    }

    /**
     * Suppression 
     */
    public function delete(User $user): void
    {
        $user->delete();
    }
}