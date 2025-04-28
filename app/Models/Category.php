<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'class',
    ];

    // /**
    //  * Relacionamento polimórfico inverso para os modelos relacionados.
    //  */
    // public function categorizables(): MorphToMany
    // {
    //     return $this->morphedByMany(Review::class, 'categorizable')
    //         ->union($this->morphedByMany(Artwork::class, 'categorizable'));
    // }
}
