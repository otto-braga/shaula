<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

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
