<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Gender extends Model
{
    use
        HasFactory,
        HasUuid,
        Fetchable;

    protected $table = 'genders';

    protected $fillable = [
        'name',
    ];

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class);
    }
}
