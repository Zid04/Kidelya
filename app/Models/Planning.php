<?php

namespace App\Models;
use Database\Factories\PlanningFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle représentant un planning d'activités.
 */
class Planning extends Model
{
    use HasFactory;

    protected $table      = 'plannings';
    protected $primaryKey = 'IdPlanning';

    protected $fillable = [
        'Title',
        'Description',
        'Location',
        'IdUser',
        'IdReport',
    ];

    public function getRouteKeyName(): string
    {
        return 'IdPlanning';
    }

    // ─── Relations ────────────────────────────────────────────

    /**
     * L'utilisateur propriétaire du planning.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }

    /**
     * Le rapport d'activité associé à ce planning.
     */
    public function reportActivity(): BelongsTo
    {
        return $this->belongsTo(ReportActivity::class, 'IdReport', 'IdReport');
    }

    /**
     * Les activités planifiées.
     * Table pivot : planning_activities
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'plannings_activities',
            'IdPlanning',
            'IdActivities'
        );
    }

    /**
     * Les groupes associés à ce planning.
     * Table pivot : planning_group
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(
            Group::class,
            'plannings_groups',
            'IdPlanning',
            'IdGroup'
        );
    }

    /**
     * Les enfants associés à ce planning.
     * Table pivot : planning_children
     */
    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'plannings_children',
            'IdPlanning',
            'IdChildren'
        );
    }
}