<?php

namespace App\Models;

use Database\Factories\GuardianFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;

class Guardian extends Model
{
    use HasFactory;

    protected $table      = 'parents';
    protected $primaryKey = 'idparent';

    protected $fillable = [
        'user_id',
        'names',
        'email',
        'phone',
        'address',
    ];

    public function getRouteKeyName(): string
    {
        return 'idparent';
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'iduser');
    }

    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'children_parents',
            'idparent',
            'idchildren'
        );
    }
}
