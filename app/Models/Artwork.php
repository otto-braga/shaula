<?php

namespace App\Models;

use App\Traits\HasFetching;
use App\Traits\HasLabel;
use App\Traits\HasSearching;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class Artwork extends Model
{
    use HasFactory, HasUuid, HasSlug, HasLabel, HasFetching, HasSearching,
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
        // Needs to ensure data is in the correct type for Meilisearch filtering.

        return [
            'id' => (int) $this->id,

            // 'uuid' => $this->uuid,
            // 'slug' => $this->slug,
            'route' => route('public.artworks.show', $this),

            'title' => $this->title ?? '',
            'authors' => $this->authors->pluck('name')->toArray(),
            // 'date' => $this->date ?? '',
            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
        ];
    }

    public function makeSearchableUsing(Collection $models): Collection
    {
        return $models->load('authors');
    }

    public function authors(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot('is_author')
            ->where('is_author', true)
            ->orderBy('name');
    }

    public function people(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot('is_author')
            ->where('is_author', false)
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

    // mentions

    public function mentioned(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioner', 'mentioner_type', 'mentioner_id');
    }

    public function mentioners(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioned', 'mentioned_type', 'mentioned_id');
    }
}
