<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Services\ThemeService;

use App\Http\Requests\Theme\StoreThemeRequest;
use App\Http\Requests\Theme\UpdateThemeRequest;

class ThemeController extends Controller
{
    public function __construct(
        private ThemeService $themeService
    ) {}

    /**
     * LIST
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->themeService->getAll()
        ]);
    }

    /**
     * CREATE
     */
    public function store(StoreThemeRequest $request): JsonResponse
    {
        $this->authorize('create', Theme::class);

        return response()->json([
            'message' => 'Theme created successfully',
            'data' => $this->themeService->create($request->validated())
        ], 201);
    }

    /**
     * SHOW
     */
    public function show(Theme $theme): JsonResponse
    {
        return response()->json([
            'data' => $theme->load('activities')
        ]);
    }

    /**
     * UPDATE
     */
    public function update(UpdateThemeRequest $request, Theme $theme): JsonResponse
    {
        $this->authorize('update', $theme);

        return response()->json([
            'message' => 'Theme updated successfully',
            'data' => $this->themeService->update($theme, $request->validated())
        ]);
    }

    /**
     * DELETE
     */
    public function destroy(Theme $theme): JsonResponse
    {
        $this->authorize('delete', $theme);

        $this->themeService->delete($theme);

        return response()->json([
            'message' => 'Theme deleted successfully'
        ]);
    }

    /**
     * ADD ACTIVITY
     */
    public function addActivity(Theme $theme, Request $request): JsonResponse
    {
         $this->authorize('update', $theme);
        $request->validate([
            'activity_id' => 'required|exists:activities,IdActivities'
        ]);

        $this->themeService->attachActivity($theme, $request->activity_id);

        return response()->json([
            'message' => 'Activity added to theme'
        ]);
    }

    /**
     * REMOVE ACTIVITY
     */
    public function removeActivity(Theme $theme, Request $request): JsonResponse
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,IdActivities'
        ]);

        $this->authorize('update', $theme);

        $this->themeService->detachActivity($theme, $request->activity_id);

        return response()->json([
            'message' => 'Activity removed from theme'
        ]);
    }
}