<?php

namespace App\Models;

use App\Traits\HasFetching;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Gender extends Model
{
    use HasFactory, HasFetching;

    protected $fillable = [
        'name',
    ];

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class);
    }
}
