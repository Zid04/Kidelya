<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
{
    $user = $request->user();

    return [
        ...parent::share($request),

        // Nom de l'application
        'appName' => config('app.name'),

        // Utilisateur connecté + rôle + plan actif
        'auth' => [
            'user' => $user,
            'role' => $user?->role?->type,

            // Le plan actif envoyé au frontend
            'plan' => $user
                ? $user->activeSubscription?->plan
                : null,
        ],

        // Permissions globales
        'can' => [
            'manageUsers'   => fn () => $user?->can('viewAny', \App\Models\User::class),
            'createPack'    => fn () => $user?->can('create', \App\Models\Pack::class),
            'createGroup'   => fn () => $user?->can('create', \App\Models\Group::class),
            'createActivity'=> fn () => $user?->can('create', \App\Models\Activity::class),
        ],

        // Messages flash
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error'   => fn () => $request->session()->get('error'),
        ],

        // Erreurs de validation
        'errors' => fn () =>
            $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],

        // État du sidebar
        'sidebarOpen' => ! $request->hasCookie('sidebar_state')
            || $request->cookie('sidebar_state') === 'true',
    ];
}

}
