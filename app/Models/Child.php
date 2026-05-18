<?php

namespace App\Models;

use Database\Factories\ChildFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Child extends Model
{
    use HasFactory;

    protected $table      = 'children';
    protected $primaryKey = 'idchildren';

    protected $fillable = [
        'lastname',
        'firstname',
        'birthday',
        'specificationnote',
        'sexe',
        'photourl',
        'iduser',
    ];

    protected $casts = [
        'birthday' => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'idchildren';
    }

    // ─── Relations ────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(
            Guardian::class,
            'children_parents',
            'idchildren',
            'idparent'
        );
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(
            Group::class,
            'groups_children',
            'idchildren',
            'idgroup'
        );
    }

    public function plannings(): BelongsToMany
    {
        return $this->belongsToMany(
            Planning::class,
            'plannings_children',
            'idchildren',
            'idplanning'
        );
    }
}
