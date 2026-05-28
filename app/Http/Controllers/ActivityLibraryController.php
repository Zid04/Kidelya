<?php

namespace App\Http\Controllers;

use App\Models\Activity;

class ActivityLibraryController extends Controller
{
    public function index()
    {
        $activities = Activity::with([
            'themes:idtheme,name',
            'competences:idcompetence,name',
            'packs:idpack,name,photourl'
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
                'included_in_packs' => $activity->packs,
            ];
        });

        return response()->json($activities);
    }
}
