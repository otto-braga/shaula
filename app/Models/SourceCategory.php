<?php

namespace App\Models;

use App\Traits\HasFetching;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class SourceCategory extends Model
{
    use HasFactory, HasUuid, HasSlug, HasFetching, Searchable;

    protected $fillable = [
        'name',
    ];

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(Source::class, 'source_source_category');
    }
}
