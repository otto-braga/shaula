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

    public function people(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'personable', 'personables')
            ->withPivot('is_mention')
            ->where('is_mention', true)
            ->orderBy('name');
    }

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
}
