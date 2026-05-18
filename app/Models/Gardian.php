<?php

namespace App\Models;

use Database\Factories\GuardianFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Guardian extends Model
{
    use HasFactory;

    protected $table      = 'parents';
    protected $primaryKey = 'idparent';

    protected $fillable = [
        'names',
        'email',
        'phone',
        'address',
        'iduser',
    ];

    public function getRouteKeyName(): string
    {
        return 'idparent';
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
