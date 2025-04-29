<?php

namespace App\Models;

use App\Traits\HasLabel;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Person extends Model
{
    use HasFactory, HasUuid, HasSlug, HasLabel;

    protected $table = 'people';

    protected $fillable = [
        'name',
        'date_of_birth',
        'date_of_death',
        'content',
    ];

    public function genders(): BelongsToMany
    {
        return $this->belongsToMany(Gender::class, 'gender_person', 'person_id', 'gender_id');
    }

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class, 'city_person', 'person_id', 'city_id')
            ->withPivot('is_default');
    }

    public function periods(): MorphToMany
    {
        return $this->morphToMany(Period::class, 'periodizable');
    }

    public function artworks(): MorphToMany
    {
        return $this->morphedByMany(Artwork::class, 'personable', 'personables')
            ->withPivot([
                'is_author',
                'is_mention',
                'activity_id',
            ])
            ->orderBy('date');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'personables', 'person_id', 'activity_id');
    }

    public function reviews(): MorphToMany
    {
        return $this->morphedByMany(Review::class, 'personable', 'personables')
            ->withPivot([
                'is_author',
                'is_mention',
                'activity_id',
            ])
            ->orderBy('date');
    }

    public function languages(): HasManyThrough
    {
        return $this->hasManyThrough(Language::class, Artwork::class, 'person_id', 'artwork_id', 'id', 'id');
    }

    // files

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')
            ->where('mime_type', 'like', 'image%')
            ->where('collection', 'general');
    }

    public function primaryImage()
    {
        return $this->images()
            ->where('is_primary', true)
            ->first();
    }

    public function contentImages(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')
            ->where('mime_type', 'like', 'image%')
            ->where('collection', 'content');
    }

    // mentions

    public function mentioned(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioner', 'mentioner_type', 'mentioner_id');
    }

    public function mentioner(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioned', 'mentioned_type', 'mentioned_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $search = $filters['search'] ?? '';

        if ($search != '') {
            $query->where('name', 'like', '%' . $search . '%');
        }

        return $query;
    }
}
