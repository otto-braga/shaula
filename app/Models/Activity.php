<?php

namespace App\Models;

use App\Traits\HasFetching;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory, HasFetching;

    protected $table = 'activities';

    protected $fillable = [
        'name',
    ];
}
