<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportActivity extends Model
{
    protected $table      = 'report_activities';
    protected $primaryKey = 'idreport';

    protected $fillable = [
        'comments',
        'positive',
        'difficulties',
        'improvements',
        'photourl',
    ];
}
