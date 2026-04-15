<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle représentant un rôle utilisateur.
 * Définit les niveaux d'accès : Admin, User, Partner.
 */
class Role extends Model
{
    protected $table      = 'roles';
    protected $primaryKey = 'IdRole';

    protected $fillable = [
        'Type', // enum : Admin | User | Partner
    ];

    public function getRouteKeyName(): string
    {
        return 'IdRole';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Les utilisateurs ayant ce rôle.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'IdRole', 'IdRole');
    }
}