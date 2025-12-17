<?php

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasMentions;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
// use Laravel\Scout\Searchable;

class Person extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasMentions,
        HasFiles;
        // Searchable;

    protected $table = 'people';

    protected $fillable = [
        'name',
        'date_of_birth',
        'date_of_death',
        'content',
        'chronology',
        'links',
    ];

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    public function toSearchableArray()
    {
        // Needs to ensure data is in the correct type for Meilisearch filtering.
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'route_base_name' => $this->getTable(),
            'route' => route('public.' . $this->getTable() . '.show', $this),

            'label' => $this->fullLabel ?? '',
            'name' => $this->name ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
            'primary_image_path' => $this->primaryImage() ? $this->primaryImage()->path : null,

            'periods' => $this->periods->pluck('name')->toArray(),
            'cities' => $this->cities->pluck('name')->toArray(),
            'artworks' => $this->artworks->pluck('title')->toArray(),

            'updated_at' => $this->updated_at ? $this->updated_at->timestamp : null,
            'created_at' => $this->created_at ? $this->created_at->timestamp : null,
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with([
            'images',
            'files',
            'periods',
            'cities',
            'artworks',
        ]);
    }

    protected function fullLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                $label = $this->name ?? '';
                if ($this->date_of_birth) {
                    $label .= ' (' . $this->date_of_birth;
                    if ($this->date_of_death) {
                        $label .= ' - ' . $this->date_of_death;
                    }
                    $label .= ')';
                }
                return $label;
            }
        );
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

    public function periods(): MorphToMany
    {
        return $this->morphToMany(Period::class, 'periodizable');
    }

    public function artworks(): MorphToMany
    {
        return $this->morphedByMany(Artwork::class, 'personable', 'personables')
            ->withPivot([
                'activity_id',
                'is_author',
            ]);
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'personables', 'person_id', 'activity_id');
    }

    public function reviews(): MorphToMany
    {
        return $this->morphedByMany(Review::class, 'personable', 'personables')
            ->withPivot([
                'activity_id',
                'is_author',
            ]);
    }

    // files

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

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

    // Sources.

    public function sources(): MorphToMany
    {
        return $this->morphToMany(Source::class, 'sourceable', 'sourceables');
    }
}
