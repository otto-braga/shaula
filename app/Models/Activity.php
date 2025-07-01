<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use
        HasFactory,
        HasUuid,
        Fetchable;

    protected $table = 'activities';

    protected $fillable = [
        'name',
    ];
}
