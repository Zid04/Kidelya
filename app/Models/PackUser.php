<?php

namespace App\Models;

use Database\Factories\PackUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackUser extends Model
{
    use HasFactory;

    protected $table      = 'packs_user';
    protected $primaryKey = 'idpackuser';

    protected $fillable = [
        'idpack',
        'iduser',
        'subscriptiondate',
        'expirationdate',
        'status',
    ];

    protected $casts = [
        'subscriptiondate' => 'date',
        'expirationdate'   => 'date',
        'status'           => 'string',
    ];

    public function getRouteKeyName(): string
    {
        return 'idpackuser';
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class, 'idpack', 'idpack');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }
}
