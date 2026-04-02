<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planing extends Model
{
     protected $primaryKey = 'IdPlaning';

    public function report_activities()
    {
        return $this->belongsTo(ReportActivities::class, 'IdReport');
    }

    public function activities()
    {
        return $this->belongsToMany(
            Activities::class,
            'planing_activities',
            'IdPlaning',
            'IdActivities'
        );
    }

    public function group()
    {
        return $this->belongsToMany(
            Group::class,
            'planing_group',
            'IdPlaning',
            'IdGroup'
        );
    }

    public function children()
    {
        return $this->belongsToMany(
            Children::class,
            'planing_children',
            'IdPlaning',
            'IdChildren'
        );
    }
}
