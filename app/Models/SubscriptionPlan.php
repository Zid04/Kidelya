<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $primaryKey = 'idplan';

    protected $fillable = [
        'name',
        'price',
        'interval',
        'interval_count',
        'has_all_packs',
        'has_planning',
        'is_active',
    ];

    public function subscriptions()
    {
        return $this->hasMany(UserSubscription::class, 'idplan');
    }
}
