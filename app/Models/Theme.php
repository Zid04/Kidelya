<?php

namespace App\Models;

use Database\Factories\ThemeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Theme extends Model
{
    use HasFactory;

    protected $table      = 'themes';
    protected $primaryKey = 'idtheme';

    protected $fillable = [
        'name',
    ];

    public function getRouteKeyName(): string
    {
        return 'idtheme';
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(
            Activity::class,
            'themes_activities',
            'idtheme',
            'idactivities'
        );
    }
}
