<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CartItem::where('iduser', auth()->id())
            ->with(['activity', 'pack'])
            ->get();

        return response()->json(['data' => $items]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idactivity' => 'nullable|exists:activities,idactivity',
            'idpack' => 'nullable|exists:packs,idpack',
            'quantity' => 'nullable|integer|min:1',
        ]);

        if (!$validated['idactivity'] && !$validated['idpack']) {
            return response()->json(['message' => 'Aucun élément fourni'], 422);
        }

        $item = CartItem::firstOrCreate(
            [
                'iduser' => auth()->id(),
                'idactivity' => $validated['idactivity'] ?? null,
                'idpack' => $validated['idpack'] ?? null,
            ],
            [
                'quantity' => $validated['quantity'] ?? 1,
            ]
        );

        // si déjà existant, on peut incrémenter
        if (!$item->wasRecentlyCreated && isset($validated['quantity'])) {
            $item->quantity += $validated['quantity'];
            $item->save();
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
