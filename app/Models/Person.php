<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Person extends Model
{
    use HasFactory, HasUuid, HasSlug;

    protected $table = 'people';

    protected $fillable = [
        'name',
        'date_of_birth',
        'date_of_death',
        'bio',
        'chrono',
    ];

    public function image()
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function genders(): BelongsToMany
    {
        return $this->belongsToMany(Gender::class, 'gender_person', 'person_id', 'gender_id');
    }

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class, 'city_person', 'person_id', 'city_id')
            ->withPivot('is_default');
    }

    public function links(): MorphMany
    {
        return $this->morphMany(Link::class, 'linkable', 'linkable_type', 'linkable_id');
    }

    public function artworks(): BelongsToMany
    {
        return $this->belongsToMany(Artwork::class, 'person_artwork', 'person_id', 'artwork_id')
            ->withPivot('activity_id');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_person', 'person_id', 'activity_id');
    }

    public function activitiesThroughArtworks(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'person_artwork', 'person_id', 'activity_id');
    }

    public function languages(): MorphToMany
    {
        return $this->morphToMany(Language::class, 'languageable');
    }

    public function languagesThroughArtworks(): BelongsToMany
    {
        return $this->belongsToMany(Language::class, 'person_artwork', 'person_id', 'language_id');
    }

    public function reviews(): BelongsToMany
    {
        return $this->belongsToMany(Review::class, 'person_review', 'person_id', 'review_id');
    }

    // public function awards(): MorphToMany
    // {
    //     return $this->morphToMany(Award::class, 'awardable');
    // }
}
