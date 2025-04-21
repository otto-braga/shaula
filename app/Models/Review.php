<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Builder;

class Review extends Model
{
    use HasFactory, HasUuid, HasSlug;

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

    // public function people(): MorphToMany
    // {
    //     return $this->morphToMany(Person::class, 'personable', 'personables')
    //         ->withPivot('is_mention')
    //         ->where('is_mention', true)
    //         ->orderBy('name');
    // }

    // files

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

    // public function mentions(): MorphMany
    // {
    //     return $this->morphMany(Mention::class, 'mentioner', 'mentioner_type', 'mentioner_id');
    // }

    public function mentioned(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioner', 'mentioner_type', 'mentioner_id');
    }

    // public function mentions()
    // {
    //     return Mention::query()
    //         ->where('mentioner_id', $this->id)
    //         ->where('mentioner_type', self::class)
    //         ->with('mentioned');
    // }

    // public function mentionsReceived(): MorphMany
    // {
    //     return $this->morphMany(Mention::class, 'mentioned', 'mentioned_type', 'mentioned_id');
    // }

    public function mentioner(): MorphMany
    {
        return $this->morphMany(Mention::class, 'mentioned', 'mentioned_type', 'mentioned_id');
    }

    // public function people()
    // {
    //     return $this->mentions()->class(Person::class);
    // }

    // public function artworks()
    // {
    //     $artworks = $this->mentionsMade()
    //         ->with('mentioned')
    //         ->where('mentioned_type', Artwork::class)
    //         ->get()
    //         ->pluck('mentioned_id')
    //         ->unique()
    //         ->map(function ($artwork_id) {
    //             return Artwork::find($artwork_id);
    //         });
    //     return $artworks;
    // }

    // public function people()
    // {
    //     $people = $this->mentionsMade()
    //         ->with('mentioned')
    //         ->where('mentioned_type', Person::class)
    //         ->get()
    //         ->pluck('mentioned_id')
    //         ->unique()
    //         ->map(function ($person_id) {
    //             return Person::find($person_id);
    //         });
    //     return $people;
    // }
}
