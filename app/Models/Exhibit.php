<?php

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
// use Laravel\Scout\Searchable;

class Artwork extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasFiles;
        // Searchable;

    protected $table = 'artworks';

    protected $fillable = [
        'title',
        'date',
        'content',
        'dimensions',
        'materials',
    ];

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    public function toSearchableArray()
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'route_base_name' => $this->getTable(),
            'route' => route('public.' . $this->getTable() . '.show', $this),

            'label' => $this->title ?? '',
            'title' => $this->title ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
            'primary_image_path' => $this->primaryImage() ? $this->primaryImage()->path : null,

            'periods' => $this->periods->pluck('name')->toArray(),
            'categories' => $this->categories->pluck('name')->toArray(),
            'authors' => $this->authors->pluck('name')->toArray(),

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
            'categories',
            'authors',
        ]);
    }

    public function authors(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot([
                'is_author',
            ])
            ->wherePivot('is_author', true)
            ->orderBy('name');
    }

    public function people(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot([
                'activity_id',
                'is_author',
            ])
            ->wherePivot('is_author', false)
            ->orderBy('name');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'personables', 'personable_id', 'activity_id')
            ->withPivot('person_id')
            ->orderBy('name');
    }

    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable');
    }

    public function periods(): MorphToMany
    {
        return $this->morphToMany(Period::class, 'periodizable');
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(Language::class, 'artwork_language', 'artwork_id', 'language_id');
    }

    // Files.

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

    // Awards.

    public function awards(): MorphToMany
    {
        return $this->morphToMany(Award::class, 'awardable', 'awardables');
    }
}
