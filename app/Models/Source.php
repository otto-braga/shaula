<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Builder;

class Source extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        Fetchable,
        Searchable;

    protected $fillable = [
        'title',
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

            'label' => $this->title ?? '',
            'title' => $this->title ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',

            'file_path' => $this->file() ? $this->file->path : null,
            'source_categories' => $this->sourceCategories->pluck('name')->toArray(),
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with([
            'file',
            'sourceCategories',
        ]);
    }

    public function sourceCategories(): BelongsToMany
    {
        return $this->belongsToMany(SourceCategory::class, 'source_source_category');
    }

    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }
}
