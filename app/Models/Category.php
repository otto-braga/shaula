<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'class',
    ];

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'category_work', 'category_id', 'work_id');
    }
}
