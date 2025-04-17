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
        ->where('activity_id', '!=', 1)
        ->unique()
        ->map(function ($activity_id) {
            return Activity::find($activity_id);
        });
    }

    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable');
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
