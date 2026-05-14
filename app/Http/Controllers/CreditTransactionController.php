<?php

namespace App\Http\Controllers;

use App\Models\CreditTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreditTransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CreditTransaction::class);

        $validated = $request->validate([
            'user_id'     => 'nullable|exists:users,iduser',
            'activity_id' => 'nullable|exists:activities,idactivities',
            'type'        => 'nullable|in:achat,conso',
        ]);

        $query = CreditTransaction::with(['user', 'activity']);

        if (!empty($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }

        if (!empty($validated['activity_id'])) {
            $query->where('activity_id', $validated['activity_id']);
        }

        if (!empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        return response()->json([
            'data' => $query->orderBy('idcredittransaction', 'desc')->paginate(20)
        ]);
    }

    public function show(CreditTransaction $transaction): JsonResponse
    {
        $this->authorize('view', $transaction);

        return response()->json([
            'data' => $transaction->load(['user', 'activity'])
        ]);
    }
}
