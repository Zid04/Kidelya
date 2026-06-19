<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use AuthorizesRequests;

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', CartItem::class);

        $items = CartItem::where('iduser', auth()->id())
            ->with(['activity', 'pack'])
            ->get();

        return response()->json(['data' => $items]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idactivity' => 'nullable|exists:activities,idactivities',
            'idpack' => 'nullable|exists:packs,idpack',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $idactivity = $validated['idactivity'] ?? null;
        $idpack = $validated['idpack'] ?? null;

        if (! $idactivity && ! $idpack) {
            return response()->json(['message' => 'Aucun élément fourni'], 422);
        }

        $item = CartItem::firstOrCreate(
            [
                'iduser' => auth()->id(),
                'idactivity' => $idactivity,
                'idpack' => $idpack,
            ],
            [
                'quantity' => $validated['quantity'] ?? 1,
            ]
        );

        if (! $item->wasRecentlyCreated) {
            $item->increment('quantity', $validated['quantity'] ?? 1);
        }

        return response()->json([
            'message' => 'Ajouté au panier',
            'data' => $item,
        ]);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorize('update', $cartItem);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->update(['quantity' => $validated['quantity']]);

        return response()->json([
            'message' => 'Quantité mise à jour',
            'data' => $cartItem,
        ]);
    }

    public function remove(CartItem $cartItem): JsonResponse
    {
        $this->authorize('delete', $cartItem);

        $cartItem->delete();

        return response()->json(['message' => 'Retiré du panier']);
    }

    public function clear(): JsonResponse
    {
        CartItem::where('iduser', auth()->id())->delete();

        return response()->json(['message' => 'Panier vidé']);
    }
}
