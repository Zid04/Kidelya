<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Comments', 'PhotoUrl', 'Improvements', 'Positive', 'Difficulties'])]

class ReportActivities extends Model
{
    protected $table = 'report_activities';
    protected $primaryKey = 'IdReport';

    public function planing()
    {
        return $this->hasOne(Planing::class, 'IdReport');
    }
}
