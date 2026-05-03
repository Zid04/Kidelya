<?php

namespace App\Models;
use Database\Factories\PackFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle représentant un pack d'activités.
 */
class Pack extends Model
{
    use HasFactory;
    
    protected $table      = 'packs';
    protected $primaryKey = 'IdPack';

    protected $fillable = [
        'Title',
        'Description',
        'Tarification',
        'Duration',
        'CreatedBy',
    ];

    protected $casts = [
        // decimal pour éviter les erreurs d'arrondi sur les prix
        'Tarification' => 'decimal:2',
        'Duration'     => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdPack';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * L'utilisateur ayant créé le pack.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'CreatedBy', 'IdUser');
    }

    /**
     * Les souscriptions associées à ce pack.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(PackUser::class, 'IdPack', 'IdPack');
    }

    /**
     * Les activités incluses dans ce pack.
     * Table pivot : pack_activities
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'packs_activities',
            'IdPack',
            'IdActivities'
        );
    }
}