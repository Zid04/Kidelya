<?php

namespace App\Http\Controllers;

use App\Models\PackUser;
use App\Models\Pack;
use App\Models\User;
use App\Services\PackUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackUserController extends Controller
{
    public function __construct(
        private readonly PackUserService $packUserService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', PackUser::class);

        return response()->json([
            'data' => PackUser::with(['user', 'pack'])->paginate(20)
        ]);
    }

    public function show(PackUser $subscription): JsonResponse
    {
        $this->authorize('view', $subscription);

        return response()->json([
            'data' => $subscription->load(['user', 'pack'])
        ]);
    }

    public function activate(Request $request): JsonResponse
    {
        $this->authorize('create', PackUser::class);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,iduser',
            'pack_id' => 'required|exists:packs,idpack',
        ]);

        $subscription = $this->packUserService->activate(
            User::find($validated['user_id']),
            Pack::find($validated['pack_id'])
        );

        return response()->json([
            'message' => 'Subscription activated successfully',
            'data'    => $subscription
        ], 201);
    }

    public function renew(PackUser $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $updated = $this->packUserService->renew($subscription);

        return response()->json([
            'message' => 'Subscription renewed successfully',
            'data'    => $updated
        ]);
    }

    public function deactivate(PackUser $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $updated = $this->packUserService->deactivate($subscription);

        return response()->json([
            'message' => 'Subscription deactivated successfully',
            'data'    => $updated
        ]);
    }
}
