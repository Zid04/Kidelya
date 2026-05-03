<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['FirstName', 'LastName', 'Email', 'Password', 'AvatarUrl', 'IdRole',  'is_active'])]
#[Hidden(['Password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]

/**
 * Modèle représentant un utilisateur de l'application.
 * Relations   : role, children, ideas, packSubscriptions, activities, groups
 */
class User extends Authenticatable
{
   
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $table      = 'users';
    protected $primaryKey = 'IdUser';

    public function getRouteKeyName(): string
    {
        return 'IdUser';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Le rôle de l'utilisateur (Admin, User, Partner).
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'IdRole', 'IdRole');
    }

    /**
     * Les enfants associés à cet utilisateur.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'IdUser', 'IdUser');
    }

    /**
     * Les idées créées par cet utilisateur.
     */
    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class, 'IdUser', 'IdUser');
    }

    /**
     * Les souscriptions aux packs de cet utilisateur.
     */
    public function packSubscriptions(): HasMany
    {
        return $this->hasMany(PackUser::class, 'IdUser', 'IdUser');
    }

    /**
     * Les activités créées par cet utilisateur.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'IdUser', 'IdUser');
    }

    /**
     * Les groupes créés par cet utilisateur.
     */
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class, 'IdUser', 'IdUser');
    }

    // ─── Casts ────────────────────────────────────────────────

    /**
     * Définit les conversions de types pour les attributs du modèle.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'Password'                => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active'              => 'boolean',
        ];
    }
}