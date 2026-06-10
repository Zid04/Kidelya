<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityPurchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLibraryController extends Controller
{
    public function show(Request $request, Activity $activity): JsonResponse
    {
        if (!$activity->is_published || !$activity->is_purchasable) {
            return response()->json(['message' => 'Activité non disponible'], 404);
        }

        $activity->load(['themes:idtheme,name', 'competences:idcompetence,name', 'packs:idpack']);
        $user = $request->user();

        // Achat individuel
        $hasPurchased = ActivityPurchase::where('user_id', $user->iduser)
            ->where('activity_id', $activity->idactivities)
            ->exists();

        // Pack actif contenant cette activité
        $userPackIds = $user->packSubscriptions()
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expirationdate')->orWhere('expirationdate', '>=', now());
            })
            ->pluck('idpack')
            ->toArray();

        $hasPack = $activity->packs->whereIn('idpack', $userPackIds)->isNotEmpty();

        // Abonnement global
        $hasSubscription = false;
        if ($activity->included_in_subscription) {
            $hasSubscription = $user->activeSubscription()
                ->where('ends_at', '>=', now())
                ->exists();
        }

        $canAccess = $hasPurchased || $hasPack || $hasSubscription;

        $data = [
            'idactivities'             => $activity->idactivities,
            'title'                    => $activity->title,
            'description'              => $activity->description,
            'photourl'                 => $activity->photourl,
            'agemin'                   => $activity->agemin,
            'agemax'                   => $activity->agemax,
            'duration'                 => $activity->duration,
            'category'                 => $activity->category,
            'difficulty'               => $activity->difficulty,
            'season'                   => $activity->season,
            'location'                 => $activity->location,
            'credit_price'             => $activity->credit_price,
            'is_purchasable'           => $activity->is_purchasable,
            'included_in_subscription' => $activity->included_in_subscription,
            'themes'                   => $activity->themes,
            'competences'              => $activity->competences,
            'is_owned'                 => $hasPurchased || $hasPack,
            'has_subscription'         => $hasSubscription,
        ];

        if ($canAccess) {
            $data['steps']     = $activity->steps;
            $data['materials'] = $activity->materials;
        }

        return response()->json(['data' => $data]);
    }

    public function index()
    {
        $activities = Activity::with([
            'themes:idtheme,name',
            'competences:idcompetence,name',
            'packs:idpack,title,illustration'
        ])
        ->where('is_published', true)
        ->get()
        ->map(function ($activity) {

            return [
                'idactivities' => $activity->idactivities,
                'title' => $activity->title,
                'photourl' => $activity->photourl,
                'agemin' => $activity->agemin,
                'agemax' => $activity->agemax,
                'duration' => $activity->duration,
                'category' => $activity->category,
                'season' => $activity->season,
                'location' => $activity->location,

                // Relations
                'themes' => $activity->themes,
                'competences' => $activity->competences,

                // Boutique
                'is_purchasable' => $activity->is_purchasable,
                'credit_price' => $activity->credit_price,
                'included_in_subscription' => $activity->included_in_subscription ?? false,
                'included_in_packs' => $activity->packs->map(fn($p) => [
                    'idpack'   => $p->idpack,
                    'name'     => $p->title,
                    'photourl' => $p->illustration,
                ]),
            ];
        });

        return response()->json($activities);
    }
}
