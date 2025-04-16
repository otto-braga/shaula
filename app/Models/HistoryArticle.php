<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class HistoryArticle extends Model
{
    use HasFactory, HasUuid, HasSlug;

    protected $fillable = [
        'title',
        'date',
        'content',
    ];

    public function authors(): MorphToMany
    {
        return $this->morphToMany(Person::class, 'authorable', 'authorables');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_history_article', 'history_article_id', 'category_id');
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
