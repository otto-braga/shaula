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
        return $this->morphToMany(Person::class, 'authorable', 'authorables');
    }

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'person_artwork', 'artwork_id', 'person_id')
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

    public function languages(): MorphToMany
    {
        return $this->morphToMany(Language::class, 'languageable'); // TODO: create pivot table
    }

    public function awards(): MorphToMany
    {
        return $this->morphToMany(Award::class, 'awardable'); // TODO: create pivot table
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_artwork', 'artwork_id', 'category_id');  // TODO: make polymorphic
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
