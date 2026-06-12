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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            ->paginate(20);

        return response()->json([
            'data' => $activities->items(),
            'meta' => [
                'total'        => $activities->total(),
                'per_page'     => $activities->perPage(),
                'current_page' => $activities->currentPage(),
                'last_page'    => $activities->lastPage(),
            ],
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

        $hasPack = !empty($userPackIds) && DB::table('packs_activities')
            ->whereIn('idpack', $userPackIds)
            ->where('idactivities', $activity->idactivities)
            ->exists();

        $hasPurchased = ActivityPurchase::where('user_id', $user->iduser)
            ->where('activity_id', $activity->idactivities)
            ->exists();

        $hasActiveSubscription = $user->activeSubscription()
            ->where('ends_at', '>=', now())
            ->exists();

        $data = $activity->toArray();
        $data['is_owned']        = $isCreator || $hasPack || $hasPurchased;
        $data['has_subscription'] = $hasActiveSubscription;

        return response()->json(['data' => $data]);
    }

    /**
     * Créer une activité
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $this->authorize('create', Activity::class);

        $data = array_merge($request->validated(), ['iduser' => auth()->id()]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('activities', 'public');
            $data['photourl'] = Storage::url($path);
        }
        unset($data['photo']);

        $rawSteps = $request->input('steps', []);
        if (!empty($rawSteps)) {
            $processedSteps = [];
            foreach ($rawSteps as $i => $step) {
                if ($request->hasFile("steps.$i.image")) {
                    $imgPath = $request->file("steps.$i.image")->store('steps', 'public');
                    $imageUrl = Storage::url($imgPath);
                } else {
                    $imageUrl = $step['image_url'] ?? null;
                }
                $processedSteps[] = ['text' => $step['text'] ?? '', 'image' => $imageUrl];
            }
            $data['steps'] = $processedSteps;
        }

        $themes      = $data['themes']      ?? [];
        $competences = $data['competences'] ?? [];
        unset($data['themes'], $data['competences']);

        $activity = $this->activityService->create($data);
        $activity->themes()->sync($themes);
        $activity->competences()->sync($competences);

        return response()->json([
            'message' => 'Activity created successfully',
            'data'    => $activity->load(['themes', 'competences'])
        ], 201);
    }

    /**
     * Modifier une activité
     */
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($activity->photourl) {
                $old = str_replace('/storage/', '', $activity->photourl);
                Storage::disk('public')->delete($old);
            }
            $path = $request->file('photo')->store('activities', 'public');
            $data['photourl'] = Storage::url($path);
        }
        unset($data['photo']);

        $rawSteps = $request->input('steps', []);
        if (!empty($rawSteps)) {
            $processedSteps = [];
            foreach ($rawSteps as $i => $step) {
                if ($request->hasFile("steps.$i.image")) {
                    $imgPath = $request->file("steps.$i.image")->store('steps', 'public');
                    $imageUrl = Storage::url($imgPath);
                } else {
                    $imageUrl = $step['image_url'] ?? null;
                }
                $processedSteps[] = ['text' => $step['text'] ?? '', 'image' => $imageUrl];
            }
            $data['steps'] = $processedSteps;
        }

        $themes      = $data['themes']      ?? null;
        $competences = $data['competences'] ?? null;
        unset($data['themes'], $data['competences']);

        $updated = $this->activityService->update($activity, $data);
        if ($themes !== null)      $updated->themes()->sync($themes);
        if ($competences !== null) $updated->competences()->sync($competences);

        return response()->json([
            'message' => 'Activity updated successfully',
            'data'    => $updated->load(['themes', 'competences'])
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
