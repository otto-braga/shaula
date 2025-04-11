<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\MorphToMany;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'fileable_id',
        'fileable_type',

        'name',
        'original_name',
        'mime_type',
        'path',

        'collection',
        'size',

        'primary',
        'temporary',
    ];

    public function fileable()
    {
        return $this->morphTo();
    }

    public function work(): MorphToMany
    {
        return $this->morphedByMany(Work::class, 'fileable');
    }
}
