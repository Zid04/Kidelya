<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'stats' => [
                'activities_created' => $user->activities()->count(),
                'activities_favorites' => $user->favorites()->count(),
                'activities_planned' => $user->plannings()->count(),
                'packs_purchased' => $user->packs()->count(),
            ],
            'activities' => $user->activities()
                ->latest()
                ->take(3)
                ->get(),
            'recommended_packs' => Pack::whereNotIn('id', $user->packs->pluck('id'))
                ->take(4)
                ->get(),
        ]);
    }
}
