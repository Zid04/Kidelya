<?php

namespace App\Services;

use App\Models\Guardian;
use Illuminate\Support\Facades\Auth;

class GuardianService
{
    /**
     * Liste tous les parents du user connecté
     */
    public function getAllForUser()
    {
        return Guardian::where('iduser', Auth::id())
            ->latest()
            ->get();
    }

    /**
     * Voir un parent (sans autorisation, la Policy s’en charge)
     */
    public function getById(int $id): ?Guardian
    {
        return Guardian::find($id);
    }

    /**
     * Créer un parent
     */
    public function create(array $data): Guardian
    {
        // Associer automatiquement le user connecté
        $data['iduser'] = Auth::id();

        return Guardian::create($data);
    }

    /**
     * Mettre à jour un parent
     */
    public function update(Guardian $guardian, array $data): Guardian
    {
        $guardian->update($data);
        return $guardian->fresh();
    }

    /**
     * Supprimer un parent
     */
    public function delete(Guardian $guardian): void
    {
        $guardian->delete();
    }
}
