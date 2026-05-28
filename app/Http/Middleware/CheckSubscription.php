<?php

namespace App\Http\Middleware;

use Closure;

class CheckSubscription
{
    public function handle($request, Closure $next)
    {
        $sub = $request->user()->subscription;

        if (!$sub || $sub->isExpired()) {
            return response()->json(['error' => 'Subscription required'], 403);
        }

        return $next($request);
    }
}
