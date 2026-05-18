<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SettingController extends Controller
{
    use AuthorizesRequests;
    
    public function index(): JsonResponse
    {
        $settings = Setting::query()
            ->whereNotNull('key')
            ->pluck('value', 'key')
            ->toArray();

        return response()->json([
            'data' => array_merge($settings, [
                'appearance' => request()->cookie('appearance', 'light')
            ])
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'app_name'       => 'sometimes|string|max:100',
            'contact_email'  => 'sometimes|email',
            'stripe_enabled' => 'sometimes|string',
            'appearance'     => 'sometimes|in:light,dark,system',
        ]);

        foreach ($validated as $key => $value) {
            if ($key !== 'appearance') {
                Setting::set($key, $value);
            }
        }

        if (isset($validated['appearance'])) {
            cookie()->queue(
                cookie('appearance', $validated['appearance'], 60 * 24 * 365)
            );
        }

        $settings = Setting::query()
            ->whereNotNull('key')
            ->pluck('value', 'key')
            ->toArray();

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès',
            'data'    => array_merge($settings, [
                'appearance' => $validated['appearance'] ?? request()->cookie('appearance', 'light')
            ])
        ]);
    }
}
