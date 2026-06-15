<?php

namespace App\Services;

use App\Models\Pack;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Storage;

class PackService
{
    public function __construct(private CloudinaryService $cloudinary) {}

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
        if (isset($data['illustration']) && $data['illustration'] instanceof \Illuminate\Http\UploadedFile) {
            $data['illustration'] = $this->cloudinary->upload($data['illustration'], 'kidelya/packs');
        } elseif (!empty($data['illustration_url'])) {
            $data['illustration'] = $data['illustration_url'];
        }
        unset($data['illustration_url']);

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
            if ($pack->illustration) {
                $this->cloudinary->delete($pack->illustration);
            }
            $data['illustration'] = $this->cloudinary->upload($data['illustration'], 'kidelya/packs');
        } elseif (!empty($data['illustration_url'])) {
            $data['illustration'] = $data['illustration_url'];
        }
        unset($data['illustration_url']);

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
     * Publier un pack
     */
    public function publish(Pack $pack): Pack
    {
        $pack->update(['is_published' => true]);
        return $pack->fresh();
    }

    /**
     * Dépublier un pack
     */
    public function unpublish(Pack $pack): Pack
    {
        $pack->update(['is_published' => false]);
        return $pack->fresh();
    }

    /**
     * Ajouter activité au pack
     */
    public function attachActivity(Pack $pack, int $activityId): void
    {
        if (!$pack->activities()->where('activities.idactivities', $activityId)->exists()) {
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
