<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(): JsonResponse
    {
        $favorites = Favorite::where('iduser', auth()->id())
            ->with(['activity', 'pack'])
            ->get();

        return response()->json(['data' => $favorites]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idactivity' => 'nullable|exists:activities,idactivity',
            'idpack' => 'nullable|exists:packs,idpack',
        ]);

        if (!$validated['idactivity'] && !$validated['idpack']) {
            return response()->json(['message' => 'Aucun élément fourni'], 422);
        }

        $favorite = Favorite::firstOrCreate([
            'iduser' => auth()->id(),
            'idactivity' => $validated['idactivity'] ?? null,
            'idpack' => $validated['idpack'] ?? null,
        ]);

        return response()->json([
            'message' => 'Ajouté aux favoris',
            'data' => $favorite,
        ]);
    }

    public function remove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idactivity' => 'nullable|exists:activities,idactivity',
            'idpack' => 'nullable|exists:packs,idpack',
        ]);

        Favorite::where('iduser', auth()->id())
            ->when($validated['idactivity'] ?? null, fn($q, $id) => $q->where('idactivity', $id))
            ->when($validated['idpack'] ?? null, fn($q, $id) => $q->where('idpack', $id))
            ->delete();

        return response()->json(['message' => 'Retiré des favoris']);
    }
}
