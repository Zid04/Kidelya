<?php

namespace App\Models;

use Database\Factories\ActivityFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $table      = 'activities';
    protected $primaryKey = 'idactivities';

    protected $fillable = [
        'title',
        'description',
        'agemin',
        'agemax',
        'duration',
        'season',
        'location',
        'photourl',
        'iduser',
'steps',
    'category',
    'difficulty',
    'materials',
        'credit_price',
        'is_purchasable',
        'is_published',
        'included_in_subscription',
    ];

    protected $casts = [
        'agemin'         => 'integer',
        'agemax'         => 'integer',
        'duration'       => 'integer',

        'credit_price'   => 'integer',
        'is_purchasable' => 'boolean',
        'is_published'   => 'boolean',
        'included_in_subscription' => 'boolean',

        'steps'          => 'array',
        'materials'      => 'array',
    ];

    // ─── Accessors ────────────────────────────────────────────

    protected function photourl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ?? asset('DefaultImg.jpg'),
        );
    }

    // ─── Relations ────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(
            Theme::class,
            'themes_activities',
            'idactivities',
            'idtheme'
        );
    }

    public function competences(): BelongsToMany
    {
        return $this->belongsToMany(
            Competence::class,
            'competences_activities',
            'idactivities',
            'idcompetence'
        );
    }

    public function plannings(): BelongsToMany
    {
        return $this->belongsToMany(
            Planning::class,
            'plannings_activities',
            'idactivities',
            'idplanning'
        );
    }

    public function packs(): BelongsToMany
    {
        return $this->belongsToMany(
            Pack::class,
            'packs_activities',
            'idactivities',
            'idpack'
        );
    }

    // ─── Scopes business ──────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopePurchasable($query)
    {
        return $query->where('is_purchasable', true);
    }
}
