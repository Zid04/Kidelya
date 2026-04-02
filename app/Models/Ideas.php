<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
#[Fillable(['Title','Notes', 'IdUser'])]
class Ideas extends Model
{
    protected $table = 'ideas';
    protected $primaryKey = 'IdIdea';

    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser');
    }
}
