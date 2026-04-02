<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'LastName',
    'FirstName',
    'BirthDay',
    'SpecificationNote',
    'Sexe',
    'PhotoUrl',
    'IdUser'
])]

class Children extends Model
{
    protected $table = 'children';
    protected $primaryKey = 'IdChildren';

      public function user()
    {
        return $this->belongsTo(User::class, 'IdUser');
    }
    public function parent()
    {
        return $this->belongsToMany(
            Parents::class,
            'children_parents',
            'IdChildren',
            'IdParent'
        );
    }

    public function group()
    {
        return $this->belongsToMany(
            Group::class,
            'group_children',
            'IdChildren',
            'IdGroup'
        );
    }
    public function planing()
    {
        return $this->belongsToMany(
            Planing::class,
            'planing_children',
            'IdChildren',
            'IdPlaning'
        );
    }

}
