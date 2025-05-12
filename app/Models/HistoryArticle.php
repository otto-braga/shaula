<?php

namespace App\Models;

use App\Traits\HasFetching;
use App\Traits\HasSearching;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class HistoryArticle extends Model
{
    use HasFactory, HasUuid, HasSlug, HasFetching, HasSearching;

    protected $fillable = [
        'title',
        'date',
        'content',
    ];

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

    public function sources()
    {
        return Source::whereHas('mentioned', function ($query) {
            $query->where('mentioned_type', 'App\Models\HistoryArticle')
                ->where('mentioned_id', $this->id);
        })->get();
    }
}
