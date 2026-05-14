<?php

namespace App\Services;

use App\Models\Idea;

class IdeaService
{
    /**
     * Récupérer toutes les idées d'un utilisateur
     */
    public function getAllForUser($user)
    {
        return Idea::where('iduser', $user->iduser)
            ->latest()
            ->get();
    }

    /**
     * Créer une idée
     */
    public function create(array $data, $user): Idea
    {
        return Idea::create([
            'title'  => $data['title'],
            'notes'  => $data['notes'] ?? null,
            'iduser' => $user->iduser,
        ]);
    }

    /**
     * Modifier une idée
     */
    public function update(Idea $idea, array $data): Idea
    {
        $idea->update($data);
        return $idea->fresh();
    }

    /**
     * Supprimer une idée
     */
    public function delete(Idea $idea): void
    {
        $idea->delete();
    }
}
