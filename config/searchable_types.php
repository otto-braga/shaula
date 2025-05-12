<?php

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\SourceResource;
use App\Models\Artwork;
use App\Models\HistoryArticle;
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
        'table' => 'reviews',
        'type' => Review::class,
        'resource' => ReviewResource::class,
    ],
    [
        'table' => 'history_articles',
        'type' => HistoryArticle::class,
        'resource' => HistoryArticleResource::class,
    ],
    [
        'table' => 'sources',
        'type' => Source::class,
        'resource' => SourceResource::class,
    ],

    [
        'table' => 'people', // Não pode ser o primeiro da lista, pois possui coluna name ao invés de title.
        'type' => Person::class,
        'resource' => PersonResource::class,
    ],

];
