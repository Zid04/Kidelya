<?php

namespace App\Services;

use App\Models\Idea;

/**
 * Service Idea
 */
class IdeaService
{
    // Récupérer toutes les idées d'un utilisateur
    public function getAllForUser($user)
    {
        return Idea::where('IdUser', $user->IdUser)->latest()->get();
    }
// creer leurs idées
    public function create(array $data, $user): Idea
    {
        return Idea::create([
            'Title'  => $data['Title'],
            'Notes'  => $data['Notes'] ?? null,
            'IdUser' => $user->IdUser,
        ]);
    }
// Seul le propriétaire de l'idée peut  la modifier .
    public function update(Idea $idea, array $data): Idea
    {
        $idea->update($data);

        return $idea->fresh();
    }
// Seul le propriétaire de l'idée peut  la supprimer.
    public function delete(Idea $idea): void
    {
        $idea->delete();
    }
}