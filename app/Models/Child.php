<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant un enfant.
 * Relations   : user, parents, groups, plannings
 */
class Child extends Model
{
    protected $table      = 'children';
    protected $primaryKey = 'IdChildren';

    protected $fillable = [
        'LastName',
        'FirstName',
        'BirthDay',
        'SpecificationNote',
        'Sexe',
        'PhotoUrl',
        'IdUser',
    ];

    protected $casts = [
        // Cast en date Carbon pour faciliter les calculs d'âge
        'BirthDay' => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdChildren';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * L'utilisateur propriétaire de la fiche enfant.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }

    /**
     * Les parents associés à cet enfant (table pivot : children_parents).
     */
    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(
            Parent::class,
            'children_parents',
            'IdChildren',
            'IdParent'
        );
    }

    /**
     * Les groupes auxquels appartient cet enfant (table pivot : groups_children).
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(
            Group::class,
            'groups_children',
            'IdChildren',
            'IdGroup'
        );
    }

    /**
     * Les plannings associés à cet enfant (table pivot : planning_children).
     */
    public function plannings(): BelongsToMany
    {
        return $this->belongsToMany(
            Planning::class,
            'plannings_children',
            'IdChildren',
            'IdPlanning'
        );
    }
}