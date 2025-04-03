<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Language extends Model
{
    use HasFactory;

    protected $table = 'languages';

    protected $fillable = [
        'name',
    ];

    public function works(): MorphToMany
    {
        return $this->morphedByMany(Work::class, 'languageable');
    }

    public function people(): MorphToMany
    {
        return $this->morphedByMany(Person::class, 'languageable');
    }
}
