<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Category extends Model
{
    use
        HasFactory,
        HasUuid,
        Fetchable;

    protected $table = 'categories';

    protected $fillable = [
        'name',
    ];

    public function categorizables(): MorphToMany
    {
        return $this->morphedByMany(Review::class, 'categorizable')
            ->union($this->morphedByMany(Artwork::class, 'categorizable'));
    }
}
