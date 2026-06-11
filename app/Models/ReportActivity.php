<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportActivity extends Model
{
    use HasFactory;
    protected $table      = 'report_activities';
    protected $primaryKey = 'idreport';

    protected $fillable = [
        'comments',
        'positive',
        'difficulties',
        'improvements',
        'photourl',
    ];

    public function photos()
    {
        return $this->hasMany(ReportPhoto::class, 'idreport', 'idreport');
    }
}
