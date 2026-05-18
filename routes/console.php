<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Désactivation des abonnements expirés — chaque nuit à minuit
Schedule::command('subscriptions:deactivate-expired')
    ->dailyAt('00:00')
    ->withoutOverlapping()
    ->runInBackground();

// Snapshot stats — juste après, à 00:05 pour avoir les chiffres post-désactivation
Schedule::command('stats:generate-daily')
    ->dailyAt('00:05')
    ->withoutOverlapping()
    ->runInBackground();
