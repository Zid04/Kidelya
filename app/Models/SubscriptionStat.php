<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionStat extends Model
{
    use HasFactory;

    protected $table = 'subscription_stats';
    protected $primaryKey = 'idstat';

    protected $fillable = [
        'date',
        'total_active',
        'total_expired',
        'new_subscriptions',
        'churned',
        'revenue',
    ];

    protected $casts = [
        'date'              => 'date',
        'total_active'      => 'integer',
        'total_expired'     => 'integer',
        'new_subscriptions' => 'integer',
        'churned'           => 'integer',
        'revenue'           => 'decimal:2',
    ];
}
