<?php

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\ReviewResource;
use App\Models\Artwork;
use App\Models\Person;
use App\Models\Review;

return [
    [
        'table' => 'artworks',
        'type' => Artwork::class,
        'resource' => ArtworkResource::class,
        'label' => 'Obras',
    ],
    [
        'table' => 'people',
        'type' => Person::class,
        'resource' => PersonResource::class,
        'label' => 'Pessoas',
    ],
    [
        'table' => 'reviews',
        'type' => Review::class,
        'resource' => ReviewResource::class,
        'label' => 'Críticas',
    ],
];
