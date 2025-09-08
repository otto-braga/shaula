<?php

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
// use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Builder;

class Source extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasFiles;
        // Searchable;

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
            'slug' => $this->slug,
            'route_base_name' => $this->getTable(),
            'route' => route('public.' . $this->getTable() . '.show', $this),

            'label' => $this->title ?? '',
            'title' => $this->title ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',

            'file_path' => $this->file() ? $this->file->path : null,

            'updated_at' => $this->updated_at ? $this->updated_at->timestamp : null,
            'created_at' => $this->created_at ? $this->created_at->timestamp : null,
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with([
            'file',
        ]);
    }

    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }

    public function files(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }
}
