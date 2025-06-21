<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait Fetchable
{
    public function scopeFetchAsSelectOption(Builder $query, $search = null, $search_key = null, $quantity = 5)
    {
        if ($search && $search == '') {
            $query->where('id', '>', 0);
        }
        elseif ($search) {
            if ($search_key && Schema::hasColumn($this->getTable(), $search_key)) {
                $query->where($search_key, 'like', "%$search%");
            } else if (Schema::hasColumn($this->getTable(), 'name')) {
                $query->where('name', 'like', "%$search%")
                    ->select('id', 'name', 'content');
            }
            else if (Schema::hasColumn($this->getTable(), 'title')) {
                $query->where('title', 'like', "%$search%")
                    ->select('id', 'title', 'content');
            }
        }

        $retval = $query->take($quantity)->get();
        $retval = $retval->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ?? $item->title,
                'description' => $item->content ? substr(strip_tags($item->content), 0, 100) : '',
            ];
        });
        $retval = $retval->toArray();

        return $retval;
    }
}
