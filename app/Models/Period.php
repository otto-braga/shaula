<?php

namespace App\Models;

use App\Traits\HasFetching;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Period extends Model
{
    use HasFactory, HasUuid, HasSlug, HasFetching;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'content',
    ];

    public function historyArticles(): MorphToMany
    {
        return $this->morphedByMany(HistoryArticle::class, 'periodizable');
    }

    // files

    public function image(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }

    public function primaryImage()
    {
        return $this->image()
            ->where('is_primary', true)
            ->first();
    }
}
