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

class Period extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        HasMentions,
        Searchable;

    protected $table = 'periods';

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
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

            'label' => $this->name ?? '',
            'name' => $this->name ?? '',

            'content' => $this->content ? substr(strip_tags($this->content), 0, 255) : '',
            'primary_image_path' => $this->primaryImage() ? $this->primaryImage()->path : null,

            'updated_at' => $this->updated_at ? $this->updated_at->timestamp : null,
            'created_at' => $this->created_at ? $this->created_at->timestamp : null,
        ];
    }

    protected function makeAllSearchableUsing(Builder $query): Builder
    {
        return $query->with([
            'images',
            'files',
        ]);
    }

    public function historyArticles(): MorphToMany
    {
        return $this->morphedByMany(HistoryArticle::class, 'periodizable');
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
