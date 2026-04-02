<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Title', 'Description', 'Tarification', 'Duration','CreatedBy'])]
class Pack extends Model
{
    protected $table = 'pack';
    protected $primaryKey = 'IdPack';

    public function creator()
    {
        return $this->belongsTo(User::class, 'CreatedBy');
    }
    public function subscriptions()
    {
        return $this->hasMany(PackUser::class, 'IdPack');
    }
}
