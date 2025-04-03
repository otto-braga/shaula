<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Award extends Model
{
    use HasFactory;

    protected $table = 'awards';

    protected $fillable = [
        'name',
        'promoter',
    ];

    public function works(): MorphToMany
    {
        return $this->morphedByMany(Work::class, 'awardable');
    }

    public function people(): MorphToMany
    {
        return $this->morphedByMany(Person::class, 'awardable');
    }
}
