<?php

namespace App\Models;

use Database\Factories\GroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    use HasFactory;

    protected $table      = 'groups';
    protected $primaryKey = 'idgroup';

    protected $fillable = [
        'name',
        'description',
        'iduser',
    ];

    public function getRouteKeyName(): string
    {
        return 'idgroup';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'groups_children',
            'idgroup',
            'idchildren'
        );
    }
}
