<?php

namespace App\Services;

use App\Models\Guardian;
use Illuminate\Support\Facades\Auth;

class GuardianService
{
    public function getAll()
    {
        return Guardian::where('user_id', Auth::id())->latest()->get();
    }

    public function getById(int $id): ?Guardian
    {
        return Guardian::find($id);
    }

    public function create(array $data): Guardian
    {
        $data['user_id'] = Auth::id();

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

    public function attachChild(Guardian $guardian, int $childId): void
    {
        $guardian->children()->syncWithoutDetaching([$childId]);
    }

    public function detachChild(Guardian $guardian, int $childId): void
    {
        $guardian->children()->detach($childId);
    }
}
