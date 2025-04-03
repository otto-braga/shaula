<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PersonCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return $this->collection->map(
            function (PersonResource $resource) use ($request) {
                return $resource->toArray($request);
            }
        )->all();
    }
}
