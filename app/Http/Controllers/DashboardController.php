<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Récupération des plannings via les enfants du user (eager loading pour éviter le N+1)
        $user->load('children.plannings');
        $plannings = $user->children
            ->flatMap(fn ($child) => $child->plannings)
            ->unique('idplanning');

        return response()->json([
            'user' => $user,

            'stats' => [
                'activities_created'   => $user->activities()->count(),
                'activities_favorites' => $user->favorites()->count(),
                'activities_planned'   => $plannings->count(),
                'packs_purchased'      => $user->packSubscriptions()->count(),
            ],

            'activities' => $user->activities()
                ->latest()
                ->take(3)
                ->get(),

            'recommended_packs' => Pack::whereNotIn(
                'idpack',
                $user->packSubscriptions->pluck('idpack')
            )
            ->take(4)
            ->get(),
        ]);
    }
}
