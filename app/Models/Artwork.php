<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Artwork extends Model
{
    use HasFactory, HasUuid, HasSlug;

    protected $table = 'artworks';

    protected $fillable = [
        'title',
        'date',
        'content',

        'dimensions',
        'materials',
    ];

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'person_artwork', 'artwork_id', 'person_id')
        ->withPivot('activity_id')
        ->wherePivot('activity_id', Activity::first()->id)
        ->orderBy('name');
    }

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'person_artwork', 'artwork_id', 'person_id')
        ->withPivot('activity_id')
        ->wherePivot('activity_id', '!=', Activity::first()->id)
        ->orderBy('name');
    }

    public function activities()
    {
        return $this->people()->get()->pluck('pivot.activity_id')
        ->where('activity_id', '!=', Activity::where('name', 'autoria')->first()->id)
        ->unique()
        ->map(function ($activity_id) {
            return Activity::find($activity_id);
        });
    }

    public function languages(): MorphToMany
    {
        return $this->morphToMany(Language::class, 'languageable');
    }

    public function awards(): MorphToMany
    {
        return $this->morphToMany(Award::class, 'awardable');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_artwork', 'artwork_id', 'category_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // files

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('mime_type', 'not like', 'image%');
    }

    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('mime_type', 'like', 'image%');
    }

    public function generalImages(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('collection', 'general');
    }

    public function contentImages(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->where('collection', 'content');
    }
}
