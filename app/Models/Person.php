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

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'person_work', 'person_id', 'work_id')
            ->withPivot('activity_id');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_person', 'person_id', 'activity_id');
    }

    public function activitiesThroughWorks(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'person_work', 'person_id', 'activity_id');
    }

    public function languages(): MorphToMany
    {
        return $this->morphToMany(Language::class, 'languageable');
    }

    public function languagesThroughWorks(): BelongsToMany
    {
        return $this->belongsToMany(Language::class, 'person_work', 'person_id', 'language_id');
    }

    public function awards(): MorphToMany
    {
        return $this->morphToMany(Award::class, 'awardable');
    }

    // mentions

    public function mentioners(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentions', 'mentioned_type', 'mentioned_id');
    }

    public function mentions(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentions', 'mentioner_type', 'mentioner_id');
    }
}
