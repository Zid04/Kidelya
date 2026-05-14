<?php

namespace App\Models;

use Database\Factories\ReportActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ReportActivity extends Model
{
    use HasFactory;

    protected $table      = 'report_activities';
    protected $primaryKey = 'idreport';

    protected $fillable = [
        'comments',
        'photourl',
        'improvements',
        'positive',
        'difficulties',
    ];

    public function getRouteKeyName(): string
    {
        return 'idreport';
    }

    public function planning(): HasOne
    {
        return $this->hasOne(Planning::class, 'idreport', 'idreport');
    }
}
