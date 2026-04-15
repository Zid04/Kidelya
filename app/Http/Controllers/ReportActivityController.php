<?php

namespace App\Http\Controllers;

use App\Models\ReportActivity;
use Illuminate\Http\JsonResponse;

use App\Services\ReportActivityService;

use App\Http\Requests\ReportActivity\StoreReportActivityRequest;
use App\Http\Requests\ReportActivity\UpdateReportActivityRequest;

class ReportActivityController extends Controller
{
    public function __construct(
        private ReportActivityService $reportService
    ) {}

    /**
     * LISTE
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => ReportActivity::with('planning')->latest()->get()
        ]);
    }

    /**
     * CREATE
     */
    public function store(StoreReportActivityRequest $request): JsonResponse
    {
        $this->authorize('create', ReportActivity::class);

        $report = $this->reportService->create($request->validated());

        return response()->json([
            'message' => 'Report created successfully',
            'data' => $report
        ], 201);
    }

    /**
     * SHOW
     */
    public function show(ReportActivity $reportActivity): JsonResponse
    {
        $this->authorize('view', $reportActivity);

        return response()->json([
            'data' => $reportActivity->load('planning')
        ]);
    }

    /**
     * UPDATE
     */
    public function update(UpdateReportActivityRequest $request, ReportActivity $reportActivity): JsonResponse
    {
        $this->authorize('update', $reportActivity);

        return response()->json([
            'message' => 'Report updated successfully',
            'data' => $this->reportService->update($reportActivity, $request->validated())
        ]);
    }

    /**
     * DELETE
     */
    public function destroy(ReportActivity $reportActivity): JsonResponse
    {
        $this->authorize('delete', $reportActivity);

        $this->reportService->delete($reportActivity);

        return response()->json([
            'message' => 'Report deleted successfully'
        ]);
    }
}