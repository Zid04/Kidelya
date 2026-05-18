<?php

namespace App\Services;

use App\Models\Pack;
use Illuminate\Support\Facades\Storage;

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
        // Upload illustration si présente
        if (isset($data['illustration']) && $data['illustration'] instanceof \Illuminate\Http\UploadedFile) {
            $data['illustration'] = $data['illustration']->store('packs', 'public');
        }

        $data['createdby'] = $user->iduser;

        return Pack::create($data);
    }

    /**
     * UPDATE
     */
    public function update(Pack $pack, array $data): Pack
    {
        // Upload illustration si présente
        if (isset($data['illustration']) && $data['illustration'] instanceof \Illuminate\Http\UploadedFile) {

            // Supprimer l'ancienne si elle existe
            if ($pack->illustration && Storage::disk('public')->exists($pack->illustration)) {
                Storage::disk('public')->delete($pack->illustration);
            }

            $data['illustration'] = $data['illustration']->store('packs', 'public');
        }

        $pack->update($data);

        return $pack->fresh();
    }

    /**
     * DELETE
     */
    public function delete(Pack $pack): void
    {
        // Supprimer l'image associée
        if ($pack->illustration && Storage::disk('public')->exists($pack->illustration)) {
            Storage::disk('public')->delete($pack->illustration);
        }

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
