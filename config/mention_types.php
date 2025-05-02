<?php

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\SourceResource;
use App\Models\Artwork;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;

return [
    [
        'table' => 'artworks',
        'type' => Artwork::class,
        'resource' => ArtworkResource::class,
    ],
    [
        'table' => 'people',
        'type' => Person::class,
        'resource' => PersonResource::class,
    ],
    [
        'table' => 'reviews',
        'type' => Review::class,
        'resource' => ReviewResource::class,
    ],
    [
        'table' => 'sources',
        'type' => Source::class,
        'resource' => SourceResource::class,
    ],

];
