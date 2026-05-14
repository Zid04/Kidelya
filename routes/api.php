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
use App\Http\Controllers\ReportActivityController;
use App\Http\Controllers\StatsController;
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

    Route::patch('packs/{pack}/publish', [PackController::class, 'publish'])
    ->name('packs.publish');
Route::patch('packs/{pack}/unpublish', [PackController::class, 'unpublish'])
    ->name('packs.unpublish');

});