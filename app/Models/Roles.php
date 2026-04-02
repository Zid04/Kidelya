<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Name'])]

class Roles extends Model
{     
      protected $table = 'roles';
      protected $primaryKey = 'IdRole';

    public function users()
    {
        return $this->hasMany(User::class, 'IdRole');
    }
}
