<?php

namespace App\Models;

use App\Traits\HasFetching;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class HistoryArticle extends Model
{
    use HasFactory, HasUuid, HasSlug, HasFetching, Searchable;

    protected $table = 'history_articles';

    protected $fillable = [
        'title',
        'date',
        'content',
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
            'route' => route('public.artworks.show', $this),
            'title' => $this->title ?? '',
            'authors' => $this->authors->pluck('name')->toArray(),
            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
            'primary_image_path' => $this->primaryImage() ? $this->primaryImage()->path : null,
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with(['authors', 'images', 'files']);
    }

    public function authors(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot('is_author')
            ->where('is_author', true)
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
