<?php

namespace App\Models;

use App\Traits\HasMentions;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class Review extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasMentions,
        Searchable;

    protected $table = 'reviews';

    protected $fillable = [
        'title',
        'date',
        'content',
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

            'categories' => $this->categories->pluck('name')->toArray(),
            'authors' => $this->authors->pluck('name')->toArray(),
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with([
            'images',
            'files',
            'categories',
            'authors',
        ]);
    }

    public function authors(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'authorable', 'authorables')
            ->orderBy('name');
    }

    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable');
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
