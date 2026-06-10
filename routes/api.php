<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ChildController;
use App\Http\Controllers\CompetenceController;
use App\Http\Controllers\CreditTransactionController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\PackUserController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\PublicPackController;
use App\Http\Controllers\ReportActivityController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\StripeSubscriptionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ActivityLibraryController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ContactController;
use App\Models\ActivityPurchase;
use App\Models\PackUser;
use App\Models\UserSubscription;



/*
|----------------------------------------------------------------------
| Routes publiques (sans authentification)
|----------------------------------------------------------------------
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('login', [AuthController::class, 'login']);
Route::post('contact', [ContactController::class, 'send']);
Route::post('newsletter', [ContactController::class, 'newsletter']);
Route::post('admin/login', [App\Http\Controllers\Auth\AdminLoginController::class, 'login']);

// Webhook Stripe — DOIT être hors du middleware auth
Route::post('stripe/webhook', [StripeController::class, 'webhook']);

Route::get('/public/packs', [PublicPackController::class, 'index'])
    ->name('public.packs.index');
Route::get('/public/packs/{pack}', [PublicPackController::class, 'show'])
    ->name('public.packs.show');
Route::get('/subscriptions/plans', [SubscriptionController::class, 'index'])
    ->name('subscriptions.plans');

/*
|----------------------------------------------------------------------
| Routes protégées
|----------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |----------------------------------------------------------------------
    | Users
    |----------------------------------------------------------------------
    */
   Route::get('users/me', function () {
    $user = auth()->user();

    $subscription = $user->activeSubscription()->with('plan')->first();

    return response()->json([
        'data' => [
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'idrole' => $user->idrole,
            'credit_balance' => $user->credit_balance,
            'role' => $user->role,
            'plan' => $subscription?->plan,
            'subscription' => $subscription ? [
                'starts_at' => $subscription->starts_at,
                'ends_at'   => $subscription->ends_at,
                'status'    => $subscription->status,
            ] : null,
        ]
    ]);
})->name('users.me');



    Route::apiResource('users', UserController::class);
    Route::patch('users/{user}/deactivate', [UserController::class, 'deactivate'])
        ->name('users.deactivate');
    Route::patch('users/{user}/activate', [UserController::class, 'activate'])
        ->name('users.activate');

    /*
    |----------------------------------------------------------------------
    | Admin Management
    |----------------------------------------------------------------------
    */
    Route::post('admin/register', [App\Http\Controllers\Auth\AdminLoginController::class, 'register'])
        ->name('admin.register');

    /*
    |----------------------------------------------------------------------
    | Activities
    |----------------------------------------------------------------------
    */
    Route::get('activities/mine', [ActivityController::class, 'mine'])->name('activities.mine');
    Route::get('activities/library', [ActivityLibraryController::class, 'index'])->name('activities.library');
    Route::get('activities/library/{activity}', [ActivityLibraryController::class, 'show'])->name('activities.library.show');
    Route::apiResource('activities', ActivityController::class);
    Route::patch('activities/{activity}/publish', [ActivityController::class, 'publish'])
        ->name('activities.publish');
    Route::patch('activities/{activity}/unpublish', [ActivityController::class, 'unpublish'])
        ->name('activities.unpublish');

    /*
    |----------------------------------------------------------------------
    | Themes
    |----------------------------------------------------------------------
    */
    Route::apiResource('themes', ThemeController::class);
    Route::post('themes/{theme}/activities', [ThemeController::class, 'addActivity'])
        ->name('themes.activities.add');
    Route::delete('themes/{theme}/activities', [ThemeController::class, 'removeActivity'])
        ->name('themes.activities.remove');

    /*
    |----------------------------------------------------------------------
    | Competences
    |----------------------------------------------------------------------
    */
    Route::apiResource('competences', CompetenceController::class);
    Route::post('competences/{competence}/activities', [CompetenceController::class, 'addActivity'])
        ->name('competences.activities.add');
    Route::delete('competences/{competence}/activities', [CompetenceController::class, 'removeActivity'])
        ->name('competences.activities.remove');

    /*
    |----------------------------------------------------------------------
    | Children
    |----------------------------------------------------------------------
    */
    Route::apiResource('children', ChildController::class);

    /*
    |----------------------------------------------------------------------
    | Guardians
    |----------------------------------------------------------------------
    */
    Route::apiResource('guardians', GuardianController::class);
    Route::post('guardians/{guardian}/children', [GuardianController::class, 'addChild'])
        ->name('guardians.children.add');
    Route::delete('guardians/{guardian}/children', [GuardianController::class, 'removeChild'])
        ->name('guardians.children.remove');

    /*
    |----------------------------------------------------------------------
    | Groups
    |----------------------------------------------------------------------
    */
    Route::apiResource('groups', GroupController::class);
    Route::post('groups/{group}/children', [GroupController::class, 'addChild'])
        ->name('groups.children.add');
    Route::delete('groups/{group}/children', [GroupController::class, 'removeChild'])
        ->name('groups.children.remove');

    /*
    |----------------------------------------------------------------------
    | Ideas
    |----------------------------------------------------------------------
    */
    Route::apiResource('ideas', IdeaController::class);

    /*
    |----------------------------------------------------------------------
    | Packs
    |----------------------------------------------------------------------
    */
    Route::apiResource('packs', PackController::class);
    Route::post('packs/{pack}/activities', [PackController::class, 'addActivity'])
        ->name('packs.activities.add');
    Route::delete('packs/{pack}/activities', [PackController::class, 'removeActivity'])
        ->name('packs.activities.remove');
    Route::patch('packs/{pack}/publish', [PackController::class, 'publish'])
        ->name('packs.publish');
    Route::patch('packs/{pack}/unpublish', [PackController::class, 'unpublish'])
        ->name('packs.unpublish');

    /*
    |----------------------------------------------------------------------
    | Subscriptions (Pack Users)
    |----------------------------------------------------------------------
    */
    Route::get('subscriptions', [PackUserController::class, 'index'])
        ->name('subscriptions.index');
    Route::get('subscriptions/{subscription}', [PackUserController::class, 'show'])
        ->name('subscriptions.show');
    Route::post('subscriptions', [PackUserController::class, 'activate'])
        ->name('subscriptions.activate');
    Route::patch('subscriptions/{subscription}/renew', [PackUserController::class, 'renew'])
        ->name('subscriptions.renew');
    Route::patch('subscriptions/{subscription}/deactivate', [PackUserController::class, 'deactivate'])
        ->name('subscriptions.deactivate');

    /*
    |----------------------------------------------------------------------
    | Credits
    |----------------------------------------------------------------------
    */
    Route::get('credits', [CreditTransactionController::class, 'index'])
        ->name('credits.index');
    Route::get('credits/{transaction}', [CreditTransactionController::class, 'show'])
        ->name('credits.show');

    /*
    |----------------------------------------------------------------------
    | Statistics
    |----------------------------------------------------------------------
    */
    Route::prefix('stats')->name('stats.')->group(function () {
        Route::get('/', [StatsController::class, 'index'])
            ->name('index');
        Route::get('today', [StatsController::class, 'today'])
            ->name('today');
        Route::get('summary', [StatsController::class, 'summary'])
            ->name('summary');
    });

    /*
    |----------------------------------------------------------------------
    | Stripe
    |----------------------------------------------------------------------
    */
    Route::prefix('stripe')->name('stripe.')->group(function () {
        Route::post('checkout', [StripeController::class, 'createCheckout'])
            ->name('checkout');
        Route::post('activity-checkout', [StripeController::class, 'createActivityCheckout'])
            ->name('activity-checkout');
        Route::get('payments', [StripeController::class, 'payments'])
            ->name('payments');
        Route::post('refund', [StripeController::class, 'refund'])
            ->name('refund');
        Route::get('coupons', [StripeController::class, 'coupons'])
            ->name('coupons');
        Route::post('coupons', [StripeController::class, 'createCoupon'])
            ->name('coupons.create');
        Route::delete('coupons/{couponId}', [StripeController::class, 'deleteCoupon'])
            ->name('coupons.delete');
    });

    /*
    |----------------------------------------------------------------------
    | Plannings
    |----------------------------------------------------------------------
    */
    Route::apiResource('plannings', PlanningController::class);
    Route::post('plannings/{planning}/activities', [PlanningController::class, 'addActivity'])
        ->name('plannings.activities.add');
    Route::delete('plannings/{planning}/activities', [PlanningController::class, 'removeActivity'])
        ->name('plannings.activities.remove');
    Route::post('plannings/{planning}/groups', [PlanningController::class, 'addGroup'])
        ->name('plannings.groups.add');
    Route::delete('plannings/{planning}/groups', [PlanningController::class, 'removeGroup'])
        ->name('plannings.groups.remove');
    Route::post('plannings/{planning}/children', [PlanningController::class, 'addChild'])
        ->name('plannings.children.add');
    Route::delete('plannings/{planning}/children', [PlanningController::class, 'removeChild'])
        ->name('plannings.children.remove');
    Route::post('plannings/{planning}/report', [PlanningController::class, 'saveReport'])
        ->name('plannings.report.save');

    /*
    |----------------------------------------------------------------------
    | Report Activities
    |----------------------------------------------------------------------
    */
    Route::apiResource('report-activities', ReportActivityController::class);

    /*
|----------------------------------------------------------------------
| Settings
|----------------------------------------------------------------------
*/
Route::get('settings', [SettingController::class, 'index'])
    ->name('settings.index');
Route::patch('settings', [SettingController::class, 'update'])
    ->name('settings.update');

    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('/subscriptions/cancel', [SubscriptionController::class, 'cancel']);
    Route::get('/subscriptions/status', [SubscriptionController::class, 'status']);

    Route::post('/stripe/subscription/checkout', [StripeSubscriptionController::class, 'checkout']);
    Route::post('/stripe/subscription/cancel', [StripeSubscriptionController::class, 'cancel']);

    // FAVORIS
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/add', [FavoriteController::class, 'add']);
    Route::delete('/favorites/remove', [FavoriteController::class, 'remove']);

    // PANIER
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::patch('/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ── Ma bibliothèque ──────────────────────────────────────────
    Route::get('/me/purchases', function () {
        $user = auth()->user();

        // Vérifier si l'abonnement actif débloque tout le contenu
        $activeSubscription = $user->activeSubscription()->with('plan')->first();
        $hasAllPacks = $activeSubscription?->plan?->has_all_packs ?? false;

        if ($hasAllPacks) {
            // ── Abonné : tout le contenu est accessible ───────────
            $activities = \App\Models\Activity::where('is_published', true)
                ->get()
                ->map(fn($a) => [
                    'idactivities' => $a->idactivities,
                    'title'        => $a->title,
                    'photourl'     => $a->photourl,
                    'agemin'       => $a->agemin,
                    'agemax'       => $a->agemax,
                    'duration'     => $a->duration,
                    'credit_price' => $a->credit_price,
                ])
                ->values();

            $packs = \App\Models\Pack::where('is_published', true)
                ->withCount('activities')
                ->get()
                ->map(fn($p) => [
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

        // ── Sans abonnement : achats individuels uniquement ────────
        $purchasedActivityIds = ActivityPurchase::where('user_id', $user->iduser)
            ->pluck('activity_id')
            ->toArray();

        $activities = ActivityPurchase::where('user_id', $user->iduser)
            ->with('activity')
            ->get()
            ->map(fn($p) => [
                'idactivities' => $p->activity?->idactivities,
                'title'        => $p->activity?->title,
                'photourl'     => $p->activity?->photourl,
                'agemin'       => $p->activity?->agemin,
                'agemax'       => $p->activity?->agemax,
                'duration'     => $p->activity?->duration,
                'credit_price' => $p->activity?->credit_price,
            ])
            ->filter(fn($a) => $a['idactivities'])
            ->values();

        $purchasedPackIds = PackUser::where('iduser', $user->iduser)
            ->pluck('idpack')
            ->toArray();

        $packs = PackUser::where('iduser', $user->iduser)
            ->with(['pack' => fn($q) => $q->withCount('activities')])
            ->get()
            ->map(fn($pu) => [
                'idpack'           => $pu->pack?->idpack,
                'title'            => $pu->pack?->title,
                'illustration'     => $pu->pack?->illustration,
                'activities_count' => $pu->pack?->activities_count ?? 0,
                'tarification'     => $pu->pack?->tarification,
            ])
            ->filter(fn($p) => $p['idpack'])
            ->values();

        $recommended_activities = \App\Models\Activity::where('is_published', true)
            ->where('is_purchasable', true)
            ->whereNotIn('idactivities', $purchasedActivityIds)
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->map(fn($a) => [
                'idactivities' => $a->idactivities,
                'title'        => $a->title,
                'photourl'     => $a->photourl,
                'agemin'       => $a->agemin,
                'agemax'       => $a->agemax,
                'duration'     => $a->duration,
                'credit_price' => $a->credit_price,
            ]);

        $recommended_packs = \App\Models\Pack::where('is_published', true)
            ->whereNotIn('idpack', $purchasedPackIds)
            ->withCount('activities')
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->map(fn($p) => [
                'idpack'           => $p->idpack,
                'title'            => $p->title,
                'illustration'     => $p->illustration,
                'activities_count' => $p->activities_count,
                'tarification'     => $p->tarification,
            ]);

        return response()->json([
            'data' => compact('activities', 'packs', 'recommended_activities', 'recommended_packs'),
        ]);
    });

    // ── Historique des transactions ──────────────────────────────
    Route::get('/me/transactions', function () {
        $user = auth()->user();
        $transactions = collect();

        ActivityPurchase::where('user_id', $user->iduser)
            ->with('activity')
            ->get()
            ->each(fn($p) => $transactions->push([
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
            ->each(fn($pu) => $transactions->push([
                'id'          => 'pack-' . $pu->idpackuser,
                'type'        => 'pack',
                'title'       => $pu->pack?->title ?? 'Pack',
                'amount'      => (float) ($pu->pack?->tarification ?? 0),
                'status'      => match ($pu->status) { 'active' => 'success', 'canceled' => 'refunded', default => 'failed' },
                'created_at'  => $pu->subscriptiondate ?? $pu->created_at,
                'payment_ref' => null,
            ]));

        UserSubscription::where('iduser', $user->iduser)
            ->with('plan')
            ->get()
            ->each(fn($sub) => $transactions->push([
                'id'          => 'sub-' . $sub->idsubscription,
                'type'        => 'subscription',
                'title'       => $sub->plan?->name ?? 'Abonnement',
                'amount'      => (float) ($sub->plan?->price ?? 0),
                'status'      => $sub->status === 'active' ? 'success' : 'refunded',
                'created_at'  => $sub->starts_at ?? $sub->created_at,
                'payment_ref' => null,
            ]));

        return response()->json(['data' => $transactions->sortByDesc('created_at')->values()]);
    });

});