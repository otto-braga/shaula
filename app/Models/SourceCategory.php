<?php

namespace App\Models;

use App\Http\Requests\FetchRequest;
use App\Traits\Fetchable;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Gate;

class SourceCategory extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        Fetchable;

    protected $fillable = [
        'name',
    ];

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(Source::class, 'source_source_category');
    }
}
