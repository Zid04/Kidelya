<?php

namespace App\Services;

use App\Models\Child;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChildService
{
    /**
     * Liste des enfants de l'utilisateur connecté
     */
    public function getAllForUser(User $user)
    {
        return Child::where('iduser', $user->iduser)
            ->with(['parents', 'groups'])
            ->latest()
            ->get();
    }

    /**
     * Création d’un enfant
     */
    public function create(array $data): Child
    {
        // On associe automatiquement l'utilisateur connecté
        $data['iduser'] = Auth::id();

        return Child::create($data);
    }

    /**
     * Mise à jour
     */
    public function update(Child $child, array $data): Child
    {
        $child->update($data);

        return $child->fresh();
    }

    /**
     * Suppression
     */
    public function delete(Child $child): void
    {
        $child->delete();
    }
}
