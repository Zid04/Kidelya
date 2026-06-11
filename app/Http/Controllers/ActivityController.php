<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivityController extends Controller
{
    use authorizesRequests;
    public function __construct(
        private readonly ActivityService $activityService
    ) {}

    /**
     * Activités de l'utilisateur connecté
     */
    public function mine(Request $request): JsonResponse
    {
        $user = $request->user();

        $activities = Activity::where('iduser', $user->iduser)
            ->with(['themes', 'competences'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $activities,
        ]);
    }

    /**
     * Liste paginée des activités (admin + filtres)
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Activity::class);
        
        $validated = $request->validate([
            'age'           => 'nullable|integer|min:0',
            'season'        => 'nullable|string|max:50',
            'themes'        => 'nullable|array',
            'themes.*'      => 'integer|exists:themes,idtheme',
            'competences'   => 'nullable|array',
            'competences.*' => 'integer|exists:competences,idcompetence',
            'published'     => 'nullable|boolean',
            'purchasable'   => 'nullable|boolean',
        ]);

        return response()->json([
            'data' => $this->activityService->getPaginated($validated),
        ]);
    }

    /**
     * Afficher une activité
     */
    public function show(Request $request, Activity $activity): JsonResponse
    {
        $this->authorize('view', $activity);

        $user = $request->user();
        $activity->load(['user', 'themes', 'competences', 'plannings', 'packs']);

        $isCreator = $activity->iduser === $user->iduser;

        // Les abonnements aux packs peuvent être sans date d'expiration (accès à vie) ou expirer dans le futur.
        $userPackIds = $user->packSubscriptions()
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expirationdate')->orWhere('expirationdate', '>=', now());
            })
            ->pluck('idpack')
            ->toArray();

        $hasPack = $activity->packs->whereIn('idpack', $userPackIds)->isNotEmpty();

        $hasPurchased = ActivityPurchase::where('user_id', $user->iduser)
            ->where('activity_id', $activity->idactivities)
            ->exists();

        $hasActiveSubscription = $user->activeSubscription()
            ->where('ends_at', '>=', now())
            ->exists();

        $data = $activity->toArray();
        // is_owned : vrai si l'utilisateur est le créateur, a acheté un pack qui la contient, ou l'a achetée individuellement.
        $data['is_owned']        = $isCreator || $hasPack || $hasPurchased;
        // has_subscription : les deux conditions doivent être vraies — l'utilisateur a un abonnement actif
        // ET l'activité est explicitement marquée comme incluse dans l'abonnement par l'admin.
        $data['has_subscription'] = $hasActiveSubscription && (bool) $activity->included_in_subscription;

        return response()->json(['data' => $data]);
    }

    /**
     * Créer une activité
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $this->authorize('create', Activity::class);

        $data = array_merge($request->validated(), ['iduser' => auth()->id()]);
        $activity = $this->activityService->create($data);

        return response()->json([
            'message' => 'Activity created successfully',
            'data'    => $activity
        ], 201);
    }

    /**
     * Modifier une activité
     */
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->update($activity, $request->validated());

        return response()->json([
            'message' => 'Activity updated successfully',
            'data'    => $updated
        ]);
    }

    /**
     * Supprimer une activité
     */
    public function destroy(Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);

        $this->activityService->delete($activity);

        return response()->json([
            'message' => 'Activity deleted successfully'
        ]);
    }

    /**
     * Publier une activité
     */
    public function publish(Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->publish($activity);

        return response()->json([
            'message' => 'Activity published successfully',
            'data'    => $updated
        ]);
    }

    /**
     * Dépublier une activité
     */
    public function unpublish(Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $updated = $this->activityService->unpublish($activity);

        return response()->json([
            'message' => 'Activity unpublished successfully',
            'data'    => $updated
        ]);
    }
}
