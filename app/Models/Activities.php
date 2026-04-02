<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Title', 'Description', 'AgeMin', 'AgeMax', 'Duration', 'Season', 'Location', 'PhotoUrl', 'IdUser'])]

class Activities extends Model
{   protected $table = 'activities';
    protected $primaryKey = 'IdActivities';

    public function themes()
    {
        return $this->belongsToMany(
            Themes::class,
            'themes_activities',
            'IdActivities',
            'IdTheme'
        );
    }

     public function competences()
    {
        return $this->belongsToMany(
            Competences::class,
            'competences_activities',
            'IdActivities',
            'IdCompetence'
        );
    }

    public function planing()
    {
        return $this->belongsToMany(
            Planing::class,
            'planing_activities',
            'IdActivities',
            'IdPlaning'
        );
    }
      public function user()
    {
        return $this->belongsTo(User::class, 'IdUser');
    }
    public function pack()
{
    return $this->belongsToMany(
        Pack::class,
        'pack_activities',
        'IdActivities',
        'IdPack'
    );
}
}
