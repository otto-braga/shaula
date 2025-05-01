<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    use HasFactory, HasUuid, HasSlug;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'content',
    ];
}
