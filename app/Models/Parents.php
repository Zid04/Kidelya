<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Names', 'Email', 'Phone','Adress'])]

class Parents extends Model
{
     protected $table = 'parents';
    protected $primaryKey = 'IdParent';

    public function children()
    {
        return $this->belongsToMany(
            Children::class,
            'children_parents',
            'IdParent',
            'IdChildren'
        );
    }
}
