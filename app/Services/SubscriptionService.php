<?php

namespace App\Services;

use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\User;
use Carbon\Carbon;

class SubscriptionService
{
    public function subscribe(User $user, SubscriptionPlan $plan): UserSubscription
    {
        $starts = Carbon::now();

        $ends = match ($plan->interval) {
            'month' => $starts->copy()->addMonth($plan->interval_count),
            'year' => $starts->copy()->addYear($plan->interval_count),
            default => $starts->copy(),
        };

        return UserSubscription::create([
            'iduser' => $user->iduser,
            'idplan' => $plan->idplan,
            'starts_at' => $starts,
            'ends_at' => $ends,
            'status' => 'active',
        ]);
    }

    public function cancel(User $user): void
    {
        if ($user->subscription) {
            $user->subscription->update(['status' => 'canceled']);
        }
    }

    public function hasAccessToPack(User $user): bool
    {
        $sub = $user->subscription;

        if (!$sub || $sub->isExpired()) {
            return false;
        }

        return $sub->plan->has_all_packs;
    }

    public function hasPlanning(User $user): bool
    {
        $sub = $user->subscription;

        if (!$sub || $sub->isExpired()) {
            return false;
        }

        return $sub->plan->has_planning;
    }
}
