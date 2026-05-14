<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'iduser';

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'is_active',
        'idrole',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active'         => 'boolean',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'idrole', 'idrole');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'iduser', 'iduser');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'iduser', 'iduser');
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class, 'iduser', 'iduser');
    }

    public function packSubscriptions(): HasMany
    {
        return $this->hasMany(PackUser::class, 'iduser', 'iduser');
    }

    public function creditTransactions(): HasMany
    {
        return $this->hasMany(CreditTransaction::class, 'iduser', 'iduser');
    }
}