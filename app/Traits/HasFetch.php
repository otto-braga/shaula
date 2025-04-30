<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait HasFetch
{
    public function scopeFetchSome(Builder $query, $search = null, $search_key = null, $quantity = 5)
    {
        if ($search) {
            if ($search_key && Schema::hasColumn($this->getTable(), $search_key)) {
                $query->where($search_key, 'like', "%$search%");
            } else if (Schema::hasColumn($this->getTable(), 'name')) {
                $query->where('name', 'like', "%$search%");
            }
            else if (Schema::hasColumn($this->getTable(), 'title')) {
                $query->where('title', 'like', "%$search%");
            }
        }

        return $query->take($quantity);
    }
}
