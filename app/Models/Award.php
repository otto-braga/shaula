<?php

namespace App\Models;

use App\Traits\HasFetching;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    use HasFactory, HasFetching;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'awards';

    protected $fillable = [
        'name',
        'promoter',
    ];
}
