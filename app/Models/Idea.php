<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle représentant une idée d'activité.
 */
class Idea extends Model
{
    protected $table      = 'ideas';
    protected $primaryKey = 'IdIdea';

    protected $fillable = [
        'Title',
        'Notes',
        'IdUser',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdIdea';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * L'utilisateur propriétaire de l'idée.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
}