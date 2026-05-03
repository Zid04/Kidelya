<?php

namespace App\Models;
use Database\Factories\PlanningActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle représentant l'association entre un planning et une activité.
 */
class PlanningActivity extends Model
{
    use HasFactory;
    
    protected $table      = 'plannings_activities';
    protected $primaryKey = 'IdPlanningActivities';

    protected $fillable = [
        'IdPlanning',
        'IdActivities',
        'DateStart',
        'DateEnd',
    ];

    protected $casts = [
        'DateStart' => 'date',
        'DateEnd'   => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdPlanningActivities';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * Le planning auquel cette entrée appartient.
     */
    public function planning(): BelongsTo
    {
        return $this->belongsTo(Planning::class, 'IdPlanning', 'IdPlanning');
    }

    /**
     * L'activité associée à cette entrée.
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'IdActivities', 'IdActivities');
    }
}