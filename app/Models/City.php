<?php

namespace App\Models;

use App\Traits\HasFetching;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory, HasFetching;

    protected $fillable = [
        'name',
    ];
}
