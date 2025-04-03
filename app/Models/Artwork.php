<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Artwork extends Model
{
    use HasFactory;

    protected $table = 'artworks';

    protected $fillable = [
        'dimensions',
        'materials',
        'is_museumized',
    ];

    public function work(): MorphOne
    {
        return $this->morphOne(Work::class, 'workable', 'workable_type', 'workable_id');
    }
}
