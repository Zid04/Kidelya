<?php

namespace App\Models;

use Database\Factories\IdeaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Idea extends Model
{
    use HasFactory;

    protected $table      = 'ideas';
    protected $primaryKey = 'ididea';

    protected $fillable = [
        'title',
        'notes',
        'iduser',
    ];

    public function getRouteKeyName(): string
    {
        return 'ididea';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }
}
