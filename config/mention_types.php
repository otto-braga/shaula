<?php

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\ReviewResource;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;

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
        'table' => 'history_articles',
        'type' => HistoryArticle::class,
        'resource' => HistoryArticleResource::class,
    ],
];
