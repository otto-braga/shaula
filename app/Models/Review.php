<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
    ];

    public function work(): MorphOne
    {
        return $this->morphOne(Work::class, 'workable', 'workable_type', 'workable_id');
    }
}
