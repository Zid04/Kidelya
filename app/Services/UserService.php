<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use App\Notifications\WelcomeNotification;

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
     * Création d'un utilisateur
     */
    public function create(array $data): User
    {
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $data['is_active'] = true;

        $user = User::create($data);
        $user->notify(new WelcomeNotification());

        return $user;
    }

    /**
     * Mise à jour utilisateur
     */
    public function update(User $user, array $data): User
    {
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    /**
     * Désactivation d'un utilisateur
     */
    public function deactivate(User $user): User
    {
        $user->update(['is_active' => false]);
        return $user->fresh();
    }

    /**
     * Activation d'un utilisateur
     */
    public function activate(User $user): User
    {
        $user->update(['is_active' => true]);
        return $user->fresh();
    }

    /**
     * Suppression
     */
    public function delete(User $user): void
    {
        $user->delete();
    }
}