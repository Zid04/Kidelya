<?php

namespace App\Models;
use Database\Factories\GroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant un groupe d'enfants.
 */
class Group extends Model
{
    use HasFactory;

    protected $table      = 'groups';
    protected $primaryKey = 'IdGroup';

    protected $fillable = [
        'Name',
        'Description',
        'IdUser',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdGroup';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * L'utilisateur propriétaire du groupe.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }

    /**
     * Les enfants appartenant à ce groupe.
     * Table pivot : groups_children
     */
    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'groups_children',
            'IdGroup',
            'IdChildren'
        );
    }
}