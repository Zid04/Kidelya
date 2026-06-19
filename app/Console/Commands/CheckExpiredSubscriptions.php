<?php

namespace App\Console\Commands;

use App\Models\UserSubscription;
use Carbon\Carbon;
use Illuminate\Console\Command;

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
