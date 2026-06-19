<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\PackUser;
use App\Models\User;
use App\Models\UserSubscription;
use App\Services\PackUserService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackUserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly PackUserService $packUserService
    ) {}

    /**
     * LISTE DES ABONNEMENTS (PACKS + PLANS)
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', PackUser::class);

        // Abonnements aux packs
        $packSubs = PackUser::with(['user', 'pack'])
            ->get()
            ->map(function ($s) {
                return [
                    'idpackuser' => $s->idpackuser,
                    'user' => $s->user,
                    'pack' => [
                        'title' => $s->pack->title,
                        'tarification' => $s->pack->tarification,
                    ],
                    'subscriptiondate' => $s->subscriptiondate,
                    'expirationdate' => $s->expirationdate,
                    'status' => $s->status,
                ];
            });

        // Abonnements aux plans (Free / Monthly / Annual)
        $planSubs = UserSubscription::with(['user', 'plan'])
            ->get()
            ->map(function ($s) {
                return [
                    'idpackuser' => $s->idsubscription,
                    'user' => $s->user,
                    'pack' => [
                        'title' => $s->plan->name,
                        'tarification' => $s->plan->price,
                    ],
                    'subscriptiondate' => $s->starts_at,
                    'expirationdate' => $s->ends_at,
                    'status' => $s->status,
                ];
            });

        // Fusion des deux
        $all = $packSubs->merge($planSubs);

        return response()->json([
            'data' => $all,
        ]);
    }

    /**
     * AFFICHER UN ABONNEMENT PACK
     */
    public function show(PackUser $subscription): JsonResponse
    {
        $this->authorize('view', $subscription);

        return response()->json([
            'data' => $subscription->load(['user', 'pack']),
        ]);
    }

    /**
     * ACTIVER UN ABONNEMENT PACK
     */
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
            'data' => $subscription,
        ], 201);
    }

    /**
     * RENOUVELER UN ABONNEMENT PACK
     */
    public function renew(PackUser $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $updated = $this->packUserService->renew($subscription);

        return response()->json([
            'message' => 'Subscription renewed successfully',
            'data' => $updated,
        ]);
    }

    /**
     * DÉSACTIVER UN ABONNEMENT PACK
     */
    public function deactivate(PackUser $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $updated = $this->packUserService->deactivate($subscription);

        return response()->json([
            'message' => 'Subscription deactivated successfully',
            'data' => $updated,
        ]);
    }
}
