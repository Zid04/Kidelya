<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['iduser', 'idactivity', 'idpack'];

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'idactivity', 'idactivity');
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class, 'idpack', 'idpack');
    }
}
