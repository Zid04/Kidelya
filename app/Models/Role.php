<?php

namespace App\Models;

use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;
 protected $table = 'user_roles'; 
    protected $primaryKey = 'idrole';

    protected $fillable = [
        'type', 
    ];

    public function getRouteKeyName(): string
    {
        return 'idrole';
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'idrole', 'idrole');
    }
}
