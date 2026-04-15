<?php

namespace App\Services;

use App\Models\Pack;

/**
 * Service Pack
 */
class PackService
{
    /**
     * ADMIN → tous les packs
     */
    public function getAllForAdmin()
    {
        return Pack::with(['creator', 'activities', 'subscriptions'])
            ->latest()
            ->get();
    }

    /**
     * PARTNER → ses packs créés
     */
    public function getOwnedPacks($user)
    {
        return Pack::where('CreatedBy', $user->IdUser)
            ->with(['creator', 'activities'])
            ->latest()
            ->get();
    }

    /**
     * USER → packs abonnés
     */
    public function getSubscribedPacks($user)
    {
        return Pack::whereHas('subscriptions', function ($q) use ($user) {
            $q->where('IdUser', $user->IdUser);
        })
        ->with(['activities'])
        ->latest()
        ->get();
    }

    /**
     * DASHBOARD GLOBAL -> selon rôle
     */
    public function getDashboardPacks($user)
    {
        return match ($user->role->Type) {

            'Admin' => $this->getAllForAdmin(),

            'Partner' => $this->getOwnedPacks($user),

            'User' => $this->getSubscribedPacks($user),

            default => collect(),
        };
    }

    /**
     * CREATE
     */
    public function create(array $data, $user): Pack
    {
        return Pack::create([
            'Title'        => $data['Title'],
            'Description'  => $data['Description'] ?? null,
            'Tarification' => $data['Tarification'],
            'Duration'     => $data['Duration'],
            'CreatedBy'    => $user->IdUser,
        ]);
    }

    public function update(Pack $pack, array $data): Pack
    {
        $pack->update($data);

        return $pack->fresh();
    }

    public function delete(Pack $pack): void
    {
        $pack->delete();
    }

    /**
     * Ajouter activité au pack
     */
    public function attachActivity(Pack $pack, int $activityId): void
    {
        if (!$pack->activities()->where('IdActivities', $activityId)->exists()) {
            $pack->activities()->attach($activityId);
        }
    }

    /**
     * Retirer activité du pack
     */
    public function detachActivity(Pack $pack, int $activityId): void
    {
        $pack->activities()->detach($activityId);
    }
}