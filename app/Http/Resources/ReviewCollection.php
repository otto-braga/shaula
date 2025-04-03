<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ReviewCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return $this->collection->map(
            function (ReviewResource $resource) use ($request) {
                return $resource->toArray($request);
            }
        )->all();
    }
}
