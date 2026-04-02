<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
#[Fillable(['Name'])]
class Themes extends Model
{    protected $table = 'themes';
     protected $primaryKey = 'IdTheme';

    public function activities()
    {
        return $this->belongsToMany(
            Activities::class,
            'themes_activities',
            'IdTheme',
            'IdActivities'
        );
    }
}
