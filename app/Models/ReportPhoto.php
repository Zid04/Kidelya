<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportPhoto extends Model
{
    protected $fillable = ['idreport', 'photourl'];

    public function report()
    {
        return $this->belongsTo(ReportActivity::class, 'idreport', 'idreport');
    }
}
