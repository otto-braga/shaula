<?php

namespace App\Traits;

use App\Http\Resources\SearchResultResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

trait Fetchable
{
    public function scopeFetchAsSelectOption(Builder $query, $q = null, $limit = 5)
    {
        if ($q) {
            if (Schema::hasColumn($this->getTable(), 'name')) {
                $query->where('name', 'like', "%$q%")
                    ->select('id', 'name');
            } else if (Schema::hasColumn($this->getTable(), 'title')) {
                $query->where('title', 'like', "%$q%")
                    ->select('id', 'title');
            }
        }

        $results = $query->take($limit)->get();
        $results = $results->map(function ($item) {
            return [
                'label' => $item->name ?? $item->title,
                'uuid' => $item->uuid,
            ];
        });
        $results = $results->toArray();

        return response()->json([
            'results' => SearchResultResource::collection($results),
        ]);
    }
}
