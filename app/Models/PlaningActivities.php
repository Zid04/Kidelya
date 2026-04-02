<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['IdPlaning', 'IdActivities', 'DateEnd', 'DateStart'])]

class PlaningActivities extends Model
{
    protected $table = 'planing_activities';
    protected $primaryKey = 'IdPlaningActivities';

    public function activities()
    {
        return $this->belongsTo(Activities::class, 'IdActivities');
    }
public function planing()
    {
        return $this->belongsTo(Planing::class, 'IdPlaning');
    }
}
