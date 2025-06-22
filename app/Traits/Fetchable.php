<?php

namespace App\Traits;

use App\Http\Resources\SearchResultResource;
use Illuminate\Database\Eloquent\Builder;
use Meilisearch\Client;

trait Fetchable
{
    public function scopeFetchAsSelectOption(Builder $query, $search = '', $quantity = 5)
    {
        $client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key')
        );

        return SearchResultResource::collection(
            $client
            ->index($this->getTable())
            ->search(
                $search,
                [
                    'limit' => $quantity,
                    // 'attributesToRetrieve' => ['id', 'label', 'content'],
                    // 'filter' => 'id > 0',
                ]
            )
            ->getHits()
        );
    }

    public function scopeFetchSingle(Builder $query, $search)
    {
        $client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key')
        );

        return SearchResultResource::collection(
            $client
            ->index($this->getTable())
            ->search(
                $search,
                [
                    'limit' => 1,
                ]
            )
            ->getHits()
        );

        return $query->where('id', '<', 0);
    }
}
