<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

#[Fillable(['Status','SubscriptionDate','ExpirationDate','IdPack', 'IdUser'])]

class PackUser extends Model
{
    protected $table = 'pack_user';
    protected $primaryKey = 'IdPackUser';

    public function pack()
    {
        return $this->belongsTo(Pack::class, 'IdPack');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser');
    }
}
