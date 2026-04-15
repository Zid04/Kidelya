<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant un thème d'activité.
 */
class Theme extends Model
{
    protected $table      = 'themes';
    protected $primaryKey = 'IdTheme';

    protected $fillable = [
        'Name',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdTheme';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Les activités associées à ce thème.
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'themes_activities',
            'IdTheme',
            'IdActivities'
        );
    }
}