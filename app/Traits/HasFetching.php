<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait HasFetching
{
    public function scopeFetchAsSelectOption(Builder $query, $search = null, $search_key = null, $quantity = 5)
    {
        if ($search) {
            if ($search_key && Schema::hasColumn($this->getTable(), $search_key)) {
                $query->where($search_key, 'like', "%$search%");
            } else if (Schema::hasColumn($this->getTable(), 'name')) {
                $query->where('name', 'like', "%$search%")
                    ->select('id', 'name');
            }
            else if (Schema::hasColumn($this->getTable(), 'title')) {
                $query->where('title', 'like', "%$search%")
                    ->select('id', 'title');
            }
        }

        $retval = $query->take($quantity)->get();
        $retval = $retval->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ?? $item->title,
            ];
        });
        $retval = $retval->toArray();

        return $retval;
    }
}
