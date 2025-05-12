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

        $query->with('authors');

        // add date column to the query if it exists
        if (Schema::hasColumn($this->getTable(), 'date')) {
            $query->addSelect('date');
        }
        elseif (Schema::hasColumn($this->getTable(), 'date_of_birth')) {
            $query->addSelect('date_of_birth as date');
        }
        else {
            $query->addSelect('created_at as date');
        }

        return $query;
    }
}
