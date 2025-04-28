<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Period extends Model
{
    protected $fillable = [
        'name',
        'timespan',
        'about',
    ];

    public function historyArticles(): HasMany
    {
        return $this->hasMany(HistoryArticle::class);
    }
}
