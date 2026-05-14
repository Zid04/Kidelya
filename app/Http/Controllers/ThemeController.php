<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use App\Services\ThemeService;

use App\Http\Requests\Theme\StoreThemeRequest;
use App\Http\Requests\Theme\UpdateThemeRequest;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function __construct(
        private ThemeService $themeService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->themeService->getAll()
        ]);
    }

    public function store(StoreThemeRequest $request): JsonResponse
    {
        $this->authorize('create', Theme::class);

        return response()->json([
            'message' => 'Theme created successfully',
            'data' => $this->themeService->create($request->validated())
        ], 201);
    }

    public function show(Theme $theme): JsonResponse
    {
        return response()->json([
            'data' => $theme->load('activities')
        ]);
    }

    public function update(UpdateThemeRequest $request, Theme $theme): JsonResponse
    {
        $this->authorize('update', $theme);

        return response()->json([
            'message' => 'Theme updated successfully',
            'data' => $this->themeService->update($theme, $request->validated())
        ]);
    }

    public function destroy(Theme $theme): JsonResponse
    {
        $this->authorize('delete', $theme);

        $this->themeService->delete($theme);

        return response()->json([
            'message' => 'Theme deleted successfully'
        ]);
    }

    public function addActivity(Theme $theme, Request $request): JsonResponse
    {
        $this->authorize('update', $theme);

        $request->validate([
            'activity_id' => 'required|exists:activities,idactivities'
        ]);

        $this->themeService->attachActivity($theme, $request->activity_id);

        return response()->json([
            'message' => 'Activity added to theme'
        ]);
    }

    public function removeActivity(Theme $theme, Request $request): JsonResponse
    {
        $this->authorize('update', $theme);

        $request->validate([
            'activity_id' => 'required|exists:activities,idactivities'
        ]);

        $this->themeService->detachActivity($theme, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from theme'
        ]);
    }
}
