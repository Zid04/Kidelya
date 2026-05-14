<?php

namespace App\Models;

use Database\Factories\PlanningActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanningActivity extends Model
{
    use HasFactory;

    protected $table      = 'plannings_activities';
    protected $primaryKey = 'idplanningactivities';

    protected $fillable = [
        'idplanning',
        'idactivities',
        'datestart',
        'dateend',
    ];

    protected $casts = [
        'datestart' => 'date',
        'dateend'   => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'idplanningactivities';
    }

    public function planning(): BelongsTo
    {
        return $this->belongsTo(Planning::class, 'idplanning', 'idplanning');
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'idactivities', 'idactivities');
    }
}
