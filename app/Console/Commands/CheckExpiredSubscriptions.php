<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserSubscription;
use Carbon\Carbon;

class CheckExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:check-expired';

    public function handle()
    {
        UserSubscription::where('status', 'active')
            ->where('ends_at', '<', Carbon::now())
            ->update(['status' => 'expired']);
    }
}
