<?php

namespace App\Services;

use App\Models\Pack;

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
        return Pack::where('createdby', $user->iduser)
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
            $q->where('iduser', $user->iduser);
        })
        ->with(['activities'])
        ->latest()
        ->get();
    }

    /**
     * Dashboard global selon rôle
     */
    public function getDashboardPacks($user)
    {
        return match ($user->role->type) {

            'Admin'   => $this->getAllForAdmin(),
            'Partner' => $this->getOwnedPacks($user),
            'User'    => $this->getSubscribedPacks($user),

            default   => collect(),
        };
    }

    /**
     * CREATE
     */
    public function create(array $data, $user): Pack
    {
        return Pack::create([
            'title'        => $data['title'],
            'description'  => $data['description'] ?? null,
            'tarification' => $data['tarification'],
            'duration'     => $data['duration'],
            'createdby'    => $user->iduser,
        ]);
    }

    /**
     * UPDATE
     */
    public function update(Pack $pack, array $data): Pack
    {
        $pack->update($data);
        return $pack->fresh();
    }

    /**
     * DELETE
     */
    public function delete(Pack $pack): void
    {
        $pack->delete();
    }

    /**
     * Ajouter activité au pack
     */
    public function attachActivity(Pack $pack, int $activityId): void
    {
        if (!$pack->activities()->where('idactivities', $activityId)->exists()) {
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
