<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityPurchase extends Model
{
    use HasFactory;

    protected $table = 'activity_purchases';
    protected $primaryKey = 'idactivitypurchase';

    protected $fillable = [
        'user_id',
        'activity_id',
        'credits_spent',
        'purchased_at',
    ];

    protected $casts = [
        'credits_spent' => 'integer',
        'purchased_at'  => 'datetime',
    ];

    // ─── Relations ────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'iduser');
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'idactivities');
    }
}
