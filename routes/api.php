<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ChildController;
use App\Http\Controllers\CompetenceController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\ReportActivityController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\UserController;


Route::middleware('auth:sanctum')->group(function () {

    /*
    |----------------------------------------------------------------------
    | Users
    |----------------------------------------------------------------------
    */
    Route::apiResource('users', UserController::class);
    Route::patch('users/{user}/deactivate', [UserController::class, 'deactivate'])
        ->name('users.deactivate');

    /*
    |----------------------------------------------------------------------
    | Activities
    |----------------------------------------------------------------------
    */
    Route::apiResource('activities', ActivityController::class);

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

    /*
    |----------------------------------------------------------------------
    | Report Activities
    |----------------------------------------------------------------------
    */
    Route::apiResource('report-activities', ReportActivityController::class);

});