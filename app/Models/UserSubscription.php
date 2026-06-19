<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
    protected $primaryKey = 'idsubscription';

    protected $fillable = [
        'iduser',
        'idplan',
        'starts_at',
        'ends_at',
        'status',
    ];

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'idplan');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser');
    }

    public function isExpired(): bool
    {
        return Carbon::now()->greaterThan($this->ends_at);
    }
}
