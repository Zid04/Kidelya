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
        return [
            ...parent::share($request),

            // Nom de l'application
            'appName' => config('app.name'),

            // Utilisateur connecté + rôle
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user()?->role?->type,
            ],

            // Permissions globales (exemples)
            'can' => [
                'manageUsers'   => fn () => $request->user()?->can('viewAny', \App\Models\User::class),
                'createPack'    => fn () => $request->user()?->can('create', \App\Models\Pack::class),
                'createGroup'   => fn () => $request->user()?->can('create', \App\Models\Group::class),
                'createActivity'=> fn () => $request->user()?->can('create', \App\Models\Activity::class),
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
