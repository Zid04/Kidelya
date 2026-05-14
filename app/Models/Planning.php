<?php

namespace App\Models;

use Database\Factories\PlanningFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Planning extends Model
{
    use HasFactory;

    protected $table      = 'plannings';
    protected $primaryKey = 'idplanning';

    protected $fillable = [
        'title',
        'description',
        'location',
        'iduser',
        'idreport',
    ];

    public function getRouteKeyName(): string
    {
        return 'idplanning';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function reportActivity(): BelongsTo
    {
        return $this->belongsTo(ReportActivity::class, 'idreport', 'idreport');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'plannings_activities',
            'idplanning',
            'idactivities'
        );
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(
            Group::class,
            'plannings_groups',
            'idplanning',
            'idgroup'
        );
    }

    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Child::class,
            'plannings_children',
            'idplanning',
            'idchildren'
        );
    }
}
