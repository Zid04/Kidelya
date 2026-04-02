<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Name', 'Description', 'IdUser'])]

class Group extends Model
{    protected $table = 'group';
     protected $primaryKey = 'IdGroup';

    public function children()
    {
        return $this->belongsToMany(
            Children::class,
            'group_children',
            'IdGroup',
            'IdChildren'
        );
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser');
    }
}
