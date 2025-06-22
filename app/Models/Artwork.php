<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasMentions;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class Artwork extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasMentions,
        Searchable;

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
            'route' => route('public.artworks.show', $this),

            'label' => $this->title ?? '',
            'title' => $this->title ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
            'primary_image_path' => $this->primaryImage() ? $this->primaryImage()->path : null,

            'periods' => $this->periods->pluck('name')->toArray(),
            'categories' => $this->categories->pluck('name')->toArray(),
            'authors' => $this->authors->pluck('name')->toArray(),
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
        return $this->morphToMany(Person::class, 'authorable', 'authorables')
            ->orderBy('name');
    }

    public function people(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot('activity_id')
            ->orderBy('name');
    }

    public function activities()
    {
        return $this->people()->get()->pluck('pivot.activity_id')
        ->unique()
        ->map(function ($activity_id) {
            return Activity::find($activity_id);
        });
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

    public function awards(): BelongsToMany
    {
        return $this->belongsToMany(Award::class, 'artwork_award', 'artwork_id', 'award_id');
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
}
