<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Activity extends Model
{
    protected $table      = 'activities';
    protected $primaryKey = 'IdActivities';

    protected $fillable = [
        'Title',
        'Description',
        'AgeMin',
        'AgeMax',
        'Duration',
        'Season',
        'Location',
        'PhotoUrl',
        'IdUser',
    ];

    protected $casts = [
        'AgeMin'    => 'integer',
        'AgeMax'    => 'integer',
        'Duration'  => 'integer',
    ];

    // ─── Relations ────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }

    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(
            Theme::class,
            'themes_activities',
            'IdActivities',
            'IdTheme'
        );
    }

    public function competences(): BelongsToMany
    {
        return $this->belongsToMany(
            Competence::class,
            'competences_activities',
            'IdActivities',
            'IdCompetence'
        );
    }

    public function plannings(): BelongsToMany
    {
        return $this->belongsToMany(
            Planning::class,
            'plannings_activities',
            'IdActivities',
            'IdPlanning'
        );
    }

    public function packs(): BelongsToMany
    {
        return $this->belongsToMany(
            Pack::class,
            'packs_activities',
            'IdActivities',
            'IdPack'
        );
    }
}