<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant un parent / tuteur légal d'un enfant.
 */
class Guardian extends Model
{
    protected $table      = 'parents';
    protected $primaryKey = 'IdParent';
    protected $fillable = [
        'Names',    
        'Email',
        'Phone',
        'Address',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdParent';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Les enfants associés à ce parent / tuteur.
     * Table pivot : children_parents
     */
    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'children_parents',
            'IdParent',
            'IdChildren'
        );
    }
}