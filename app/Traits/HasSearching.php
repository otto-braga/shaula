<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait HasSearching
{
    public function scopeSearch(Builder $query, string $key)
    {
        if ($key == '') {
            return $query;
        }

        $query = $query->where(
            Schema::hasColumn($this->getTable(), 'name') ? 'name' : 'title',
            'like',
            "%$key%"
        )->select(
            'id',
            Schema::hasColumn($this->getTable(), 'name') ? 'name' : 'title'
        );

        // add $this::class column to te query without escaping the \ character
        $query = $query->selectRaw("'".str_replace('\\', '\\\\', $this::class) ."' as type");

        return $query;
    }
}
