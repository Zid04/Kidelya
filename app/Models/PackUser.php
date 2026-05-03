<?php

namespace App\Models;
use Database\Factories\PackUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle représentant la souscription d'un utilisateur à un pack.
 *
 * Ce n'est pas une simple table pivot car elle possède
 * ses propres données métier (dates, statut).
 */
class PackUser extends Model
{
    use HasFactory;
    
    protected $table      = 'pack_users';
    protected $primaryKey = 'IdPackUser';

    protected $fillable = [
        'IdPack',
        'IdUser',
        'SubscriptionDate',
        'ExpirationDate',
        'Status',
    ];

    protected $casts = [
        'SubscriptionDate' => 'date',
        'ExpirationDate'   => 'date',
        'Status'           => 'string',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdPackUser';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Le pack auquel cette souscription appartient.
     */
    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class, 'IdPack', 'IdPack');
    }

    /**
     * L'utilisateur ayant souscrit au pack.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
}