<?php

namespace App\Models;

use Database\Factories\CompetenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Competence extends Model
{
    use HasFactory;

    protected $table      = 'competences';
    protected $primaryKey = 'idcompetence';

    protected $fillable = [
        'name',
    ];

    public function getRouteKeyName(): string
    {
        return 'idcompetence';
    }

    // ─── Relations ────────────────────────────────────────────

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'competences_activities',
            'idcompetence',
            'idactivities'
        );
    }
}
