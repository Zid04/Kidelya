<?php

namespace App\Models;
use Database\Factories\ReportActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Modèle représentant le rapport d'une activité planifiée.
 * Relations   : planning
 */
class ReportActivity extends Model
{
    use HasFactory;

    protected $table      = 'report_activities';
    protected $primaryKey = 'IdReport';

    protected $fillable = [
        'Comments',
        'PhotoUrl',
        'Improvements',
        'Positive',
        'Difficulties',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdReport';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Le planning associé à ce rapport.
     * Un rapport appartient à un seul planning (hasOne inverse).
     */
    public function planning(): HasOne
    {
        return $this->hasOne(Planning::class, 'IdReport', 'IdReport');
    }
}