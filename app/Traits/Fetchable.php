<?php

namespace App\Traits;

use App\Http\Resources\SearchResultResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;

trait Fetchable
{
    public function scopeFetchAsSelectOptions(Builder $query, $q = null, $limit = 5)
    {
        Gate::authorize('view', $this->getModel());

        if ($q) {
            if (Schema::hasColumn($this->getTable(), 'name')) {
                $query->where('name', 'like', "%$q%")
                    ->select('uuid', 'name');

                if (!Gate::allows('dev', $this->getModel())) {
                    $query->where('name', 'not like', 'dev%');
                }
            } else if (Schema::hasColumn($this->getTable(), 'title')) {
                $query->where('title', 'like', "%$q%")
                    ->select('uuid', 'title');

                if (!Gate::allows('dev', $this->getModel())) {
                    $query->where('title', 'not like', 'dev%');
                }
            }
        }

        $results = $query->take($limit)->get();
        $results = $results->map(function ($item) {
            return [
                'label' => $item->label ?? ($item->name ?? $item->title),
                'uuid' => $item->uuid,
            ];
        });
        $results = $results->toArray();

        return response()->json([
            'results' => SearchResultResource::collection($results),
        ]);
    }

    public static function fetchAllAsSelectOptions()
    {
        Gate::authorize('view', static::class);

        $results = self::query();

        if (!Gate::allows('dev', static::class)) {
            if (Schema::hasColumn((new static)->getTable(), 'name')) {
                $results->where('name', 'not like', 'dev%');
            } elseif (Schema::hasColumn((new static)->getTable(), 'title')) {
                $results->where('title', 'not like', 'dev%');
            }
        }

        $results = $results->get();

        $results = $results->map(function ($item) {
            return [
                'label' => $item->label ?? ($item->name ?? $item->title),
                'uuid' => $item->uuid,
            ];
        })->toArray();

        return response()->json([
            'results' => SearchResultResource::collection($results),
        ]);
    }
}
