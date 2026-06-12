<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityPurchase;
use App\Models\Pack;
use App\Models\PackUser;
use App\Models\UserSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MeController extends Controller
{
    /**
     * Retourne le profil de l'utilisateur connecté avec son abonnement actif.
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        $subscription = $user->activeSubscription()->with('plan')->first();

        return response()->json([
            'data' => [
                'id'             => $user->id,
                'firstname'      => $user->firstname,
                'lastname'       => $user->lastname,
                'email'          => $user->email,
                'idrole'         => $user->idrole,
                'credit_balance' => $user->credit_balance,
                'role'           => $user->role,
                'plan'           => $subscription?->plan,
                'subscription'   => $subscription ? [
                    'starts_at' => $subscription->starts_at,
                    'ends_at'   => $subscription->ends_at,
                    'status'    => $subscription->status,
                ] : null,
            ],
        ]);
    }

    /**
     * Retourne les activités et packs accessibles par l'utilisateur.
     * Si l'abonnement inclut tous les packs, tout le contenu publié est retourné.
     * Sinon, seuls les achats individuels sont retournés.
     */
    public function purchases(): JsonResponse
    {
        $user = auth()->user();

        $activeSubscription = $user->activeSubscription()->with('plan')->first();
        $hasAllPacks = $activeSubscription?->plan?->has_all_packs ?? false;

        if ($hasAllPacks) {
            $activities = Activity::where('is_published', true)
                ->get()
                ->map(fn ($a) => [
                    'idactivities' => $a->idactivities,
                    'title'        => $a->title,
                    'photourl'     => $a->photourl,
                    'agemin'       => $a->agemin,
                    'agemax'       => $a->agemax,
                    'duration'     => $a->duration,
                    'credit_price' => $a->credit_price,
                ])
                ->values();

            $packs = Pack::where('is_published', true)
                ->withCount('activities')
                ->get()
                ->map(fn ($p) => [
                    'idpack'           => $p->idpack,
                    'title'            => $p->title,
                    'illustration'     => $p->illustration,
                    'activities_count' => $p->activities_count,
                    'tarification'     => $p->tarification,
                ])
                ->values();

            return response()->json([
                'data' => [
                    'activities'              => $activities,
                    'packs'                   => $packs,
                    'recommended_activities'  => [],
                    'recommended_packs'       => [],
                    'subscription_all_access' => true,
                ],
            ]);
        }

        // Activités achetées individuellement
        $purchasedActivityIds = ActivityPurchase::where('user_id', $user->iduser)
            ->pluck('activity_id')
            ->toArray();

        // Packs actifs non expirés
        $activePackIds = PackUser::where('iduser', $user->iduser)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expirationdate')->orWhere('expirationdate', '>=', now());
            })
            ->pluck('idpack')
            ->toArray();

        // Activités issues des packs actifs
        $packActivityIds = !empty($activePackIds)
            ? DB::table('packs_activities')
                ->whereIn('idpack', $activePackIds)
                ->pluck('idactivities')
                ->toArray()
            : [];

        // Fusion : achats individuels + activités de packs
        $allActivityIds = array_values(array_unique(array_merge($purchasedActivityIds, $packActivityIds)));

        $activities = Activity::whereIn('idactivities', $allActivityIds)
            ->where('is_published', true)
            ->get()
            ->map(fn ($a) => [
                'idactivities' => $a->idactivities,
                'title'        => $a->title,
                'photourl'     => $a->photourl,
                'agemin'       => $a->agemin,
                'agemax'       => $a->agemax,
                'duration'     => $a->duration,
                'credit_price' => $a->credit_price,
            ])
            ->values();

        // Seulement les packs actifs non expirés
        $packs = PackUser::where('iduser', $user->iduser)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expirationdate')->orWhere('expirationdate', '>=', now());
            })
            ->with(['pack' => fn ($q) => $q->withCount('activities')])
            ->get()
            ->map(fn ($pu) => [
                'idpack'           => $pu->pack?->idpack,
                'title'            => $pu->pack?->title,
                'illustration'     => $pu->pack?->illustration,
                'activities_count' => $pu->pack?->activities_count ?? 0,
                'tarification'     => $pu->pack?->tarification,
            ])
            ->filter(fn ($p) => $p['idpack'])
            ->values();

        $purchasedPackIds = $activePackIds;

        $recommended_activities = Activity::where('is_published', true)
            ->where('is_purchasable', true)
            ->whereNotIn('idactivities', $purchasedActivityIds)
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->map(fn ($a) => [
                'idactivities' => $a->idactivities,
                'title'        => $a->title,
                'photourl'     => $a->photourl,
                'agemin'       => $a->agemin,
                'agemax'       => $a->agemax,
                'duration'     => $a->duration,
                'credit_price' => $a->credit_price,
            ]);

        $recommended_packs = Pack::where('is_published', true)
            ->whereNotIn('idpack', $purchasedPackIds)
            ->withCount('activities')
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->map(fn ($p) => [
                'idpack'           => $p->idpack,
                'title'            => $p->title,
                'illustration'     => $p->illustration,
                'activities_count' => $p->activities_count,
                'tarification'     => $p->tarification,
            ]);

        return response()->json([
            'data' => compact('activities', 'packs', 'recommended_activities', 'recommended_packs'),
        ]);
    }

    /**
     * Retourne l'historique de toutes les transactions de l'utilisateur
     * (achats d'activités, de packs, et abonnements).
     */
    public function transactions(): JsonResponse
    {
        $user = auth()->user();
        $transactions = collect();

        ActivityPurchase::where('user_id', $user->iduser)
            ->with('activity')
            ->get()
            ->each(fn ($p) => $transactions->push([
                'id'          => 'act-' . $p->idactivitypurchase,
                'type'        => 'activity',
                'title'       => $p->activity?->title ?? 'Activité',
                'amount'      => 0,
                'status'      => 'success',
                'created_at'  => $p->purchased_at ?? $p->created_at,
                'payment_ref' => null,
            ]));

        PackUser::where('iduser', $user->iduser)
            ->with('pack')
            ->get()
            ->each(fn ($pu) => $transactions->push([
                'id'          => 'pack-' . $pu->idpackuser,
                'type'        => 'pack',
                'title'       => $pu->pack?->title ?? 'Pack',
                'amount'      => (float) ($pu->pack?->tarification ?? 0),
                'status'      => match ($pu->status) {
                    'active'   => 'success',
                    'canceled' => 'refunded',
                    default    => 'failed',
                },
                'created_at'  => $pu->subscriptiondate ?? $pu->created_at,
                'payment_ref' => null,
            ]));

        UserSubscription::where('iduser', $user->iduser)
            ->with('plan')
            ->get()
            ->each(fn ($sub) => $transactions->push([
                'id'          => 'sub-' . $sub->idsubscription,
                'type'        => 'subscription',
                'title'       => $sub->plan?->name ?? 'Abonnement',
                'amount'      => (float) ($sub->plan?->price ?? 0),
                'status'      => $sub->status === 'active' ? 'success' : 'refunded',
                'created_at'  => $sub->starts_at ?? $sub->created_at,
                'payment_ref' => null,
            ]));

        return response()->json([
            'data' => $transactions->sortByDesc('created_at')->values(),
        ]);
    }
}
