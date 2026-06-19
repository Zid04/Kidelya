<?php

use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->statefulApi();
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        $middleware->api(prepend: [
            CorsMiddleware::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $isApiRequest = fn ($request) => $request->expectsJson()
            || str_starts_with($request->path(), 'api/');

        $exceptions->render(function (
            AuthenticationException $e,
            $request
        ) use ($isApiRequest) {
            if ($isApiRequest($request)) {
                return response()->json(['message' => 'Non authentifié.'], 401);
            }
        });

        $exceptions->render(function (
            AuthorizationException $e,
            $request
        ) use ($isApiRequest) {
            if ($isApiRequest($request)) {
                return response()->json(['message' => 'Action non autorisée.'], 403);
            }
        });

        $exceptions->render(function (
            ModelNotFoundException $e,
            $request
        ) use ($isApiRequest) {
            if ($isApiRequest($request)) {
                return response()->json(['message' => 'Ressource introuvable.'], 404);
            }
        });
    }
    )->create();
