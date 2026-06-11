<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use App\Models\ReportActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\PlanningService;

use App\Http\Requests\Planning\StorePlanningRequest;
use App\Http\Requests\Planning\UpdatePlanningRequest;
use App\Http\Requests\Planning\AddActivityToPlanningRequest;
use App\Http\Requests\Planning\AddGroupToPlanningRequest;
use App\Http\Requests\Planning\AddChildToPlanningRequest;

use App\Http\Requests\Planning\RemoveActivityFromPlanningRequest;
use App\Http\Requests\Planning\RemoveGroupFromPlanningRequest;
use App\Http\Requests\Planning\RemoveChildFromPlanningRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PlanningController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(
        private PlanningService $planningService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Planning::class);

        return response()->json([
            'data' => $this->planningService->getAllForUser(auth()->user())
        ]);
    }

    public function store(StorePlanningRequest $request): JsonResponse
    {
        $this->authorize('create', Planning::class);

        $user             = auth()->user();
        $activeSubscription = $user->activeSubscription()->with('plan')->first();
        // Plan gratuit : aucun abonnement actif, ou un abonnement dont le prix est 0.
        $isFree           = !$activeSubscription || ($activeSubscription->plan->price ?? 0) == 0;

        // Règle métier : les utilisateurs gratuits sont limités à 1 planning pour les inciter à passer à un abonnement payant.
        if ($isFree) {
            $count = Planning::where('iduser', $user->iduser)->count();
            if ($count >= 1) {
                return response()->json([
                    'message' => 'Le plan gratuit est limité à 1 planning. Passez à un abonnement payant pour en créer davantage.',
                ], 403);
            }
        }

        $validated = $request->validated();
        // idchild n'est pas une colonne directe de la table plannings — l'enfant doit être rattaché via la table pivot après la création.
        $idchild   = $validated['idchild'] ?? null;
        unset($validated['idchild']);

        $planning = $this->planningService->create($validated, $user);

        if ($idchild) {
            $this->planningService->attachChild($planning, (int) $idchild);
        }

        return response()->json([
            'message' => 'Planning created successfully',
            'data' => $planning
        ], 201);
    }

    public function show(Planning $planning): JsonResponse
    {
        $this->authorize('view', $planning);

        return response()->json([
            'data' => $planning->load(['children', 'activities', 'groups', 'report.photos'])
        ]);
    }

    public function saveReport(Request $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $data = $request->validate([
            'comments'     => 'nullable|string',
            'positive'     => 'nullable|string',
            'difficulties' => 'nullable|string',
            'improvements' => 'nullable|string',
            'photos'       => 'nullable|array',
            'photos.*'     => 'image|max:5120',
        ]);

        unset($data['photos']);

        if ($planning->idreport) {
            $planning->report->update($data);
            $report = $planning->report;
        } else {
            $report = ReportActivity::create($data);
            $planning->update(['idreport' => $report->idreport]);
        }

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('reports', 'public');
                \App\Models\ReportPhoto::create(['idreport' => $report->idreport, 'photourl' => $path]);
            }
        }

        return response()->json([
            'message' => 'Rapport enregistré.',
            'data'    => $planning->fresh()->load('report.photos'),
        ]);
    }

    public function update(UpdatePlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        return response()->json([
            'message' => 'Planning updated successfully',
            'data' => $this->planningService->update($planning, $request->validated())
        ]);
    }

    public function destroy(Planning $planning): JsonResponse
    {
        $this->authorize('delete', $planning);

        $this->planningService->delete($planning);

        return response()->json([
            'message' => 'Planning deleted successfully'
        ]);
    }

    public function addActivity(AddActivityToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachActivity($planning, $request->activity_id, $request->datestart, $request->dateend);

        return response()->json([
            'message' => 'Activity added to planning'
        ]);
    }

    public function addGroup(AddGroupToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachGroup($planning, $request->group_id);

        return response()->json([
            'message' => 'Group added to planning'
        ]);
    }

    public function addChild(AddChildToPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->attachChild($planning, $request->child_id);

        return response()->json([
            'message' => 'Child added to planning'
        ]);
    }

    public function removeActivity(RemoveActivityFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachActivity($planning, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from planning'
        ]);
    }

    public function removeGroup(RemoveGroupFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachGroup($planning, $request->group_id);

        return response()->json([
            'message' => 'Group removed from planning'
        ]);
    }

    public function removeChild(RemoveChildFromPlanningRequest $request, Planning $planning): JsonResponse
    {
        $this->authorize('update', $planning);

        $this->planningService->detachChild($planning, $request->child_id);

        return response()->json([
            'message' => 'Child removed from planning'
        ]);
    }
}
