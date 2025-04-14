<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Activity extends Model
{
    use HasFactory, HasSlug;

    protected $table = 'activities';

    protected $fillable = [
        'name',
    ];

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'activity_person', 'activity_id', 'person_id');
    }

    public function peopleThroughArtworks()
    {
        return $this->belongsToMany(Person::class, 'person_artwork', 'activity_id', 'person_id');
    }
}
