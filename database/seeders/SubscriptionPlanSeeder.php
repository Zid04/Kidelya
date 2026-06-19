<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'           => 'Free',
                'price'          => 0,
                'interval'       => 'none',
                'interval_count' => 0,
                'has_all_packs'  => false,
                'has_planning'   => false,
                'is_active'      => true,
            ],
            [
                'name'           => 'Monthly',
                'price'          => 5.99,
                'interval'       => 'month',
                'interval_count' => 1,
                'has_all_packs'  => true,
                'has_planning'   => true,
                'is_active'      => true,
            ],
            [
                'name'           => 'Annual',
                'price'          => 49.99,
                'interval'       => 'year',
                'interval_count' => 1,
                'has_all_packs'  => true,
                'has_planning'   => true,
                'is_active'      => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
