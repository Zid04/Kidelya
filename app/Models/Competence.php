<?php

namespace App\Models;
use Database\Factories\CompetenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant une compétence.
 */
class Competence extends Model
{
    use HasFactory;
    protected $table      = 'competences';
    protected $primaryKey = 'IdCompetence';

    protected $fillable = [
        'Name',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdCompetence';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Les activités associées à cette compétence.
     * Table pivot : competences_activities
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'competences_activities',
            'IdCompetence',
            'IdActivities'
        );
    }
}