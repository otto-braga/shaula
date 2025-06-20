<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasFile;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Searchable;

class Source extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        Fetchable,
        Searchable;

    protected $fillable = [
        'title',
        'content',
    ];

    public function sourceCategories(): BelongsToMany
    {
        return $this->belongsToMany(SourceCategory::class, 'source_source_category');
    }

    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }
}
