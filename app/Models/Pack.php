<?php

namespace App\Models;

use Database\Factories\PackFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pack extends Model
{
    use HasFactory;

    protected $table      = 'packs';
    protected $primaryKey = 'idpack';

    protected $fillable = [
        'title',
        'description',
        'tarification',
        'duration',
        'createdby',

      
        'is_published',
        'type',
    ];

    protected $casts = [
        'tarification' => 'decimal:2',
        'duration'     => 'integer',

       
        'is_published' => 'boolean',
        'type'         => 'string',
    ];

    public function getRouteKeyName(): string
    {
        return 'idpack';
    }

    // ─── Relations ────────────────────────────────────────────

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdby', 'iduser');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(PackUser::class, 'idpack', 'idpack');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'packs_activities',
            'idpack',
            'idactivities'
        );
    }

    // ─── Scopes business ──────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
