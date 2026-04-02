<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Competences extends Model
{
    
    protected $primaryKey = 'IdCompetence';

    public function themes()
    {
        return $this->belongsToMany(
            Theme::class,
            'competences_activities',
            'IdCompetence',
            'IdActivities'
        );
    }
}
