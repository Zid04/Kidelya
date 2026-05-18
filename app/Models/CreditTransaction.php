<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditTransaction extends Model
{
    use HasFactory;

    protected $table = 'credit_transactions';
    protected $primaryKey = 'idcredittransaction';

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'activity_id',
        'ref_stripe',
    ];

    protected $casts = [
        'amount' => 'integer',
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
