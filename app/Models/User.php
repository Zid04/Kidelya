<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['FirstName', 'LastName', 'Email', 'Password', 'AvatarUrl', 'IdRole'])]
#[Hidden(['Password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]

class User extends Authenticatable
{ /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;
     protected $table = 'users';
     protected $primaryKey = 'IdUser';

    public function role()
    {
        return $this->belongsTo(Role::class, 'IdRole');
    }

    public function children()
    {
        return $this->hasMany(Children::class, 'IdUser');
    }

    public function ideas()
    {
        return $this->hasMany(Idea::class, 'IdUser');
    }

    public function packSubscriptions()
    {
        return $this->hasMany(PackUser::class, 'IdUser');
    }
   
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
