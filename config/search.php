<?php

namespace App\Models;

return [
    'index' => [

        Artwork::class => [
            'indexUid' => 'artworks',
            'searchableAttributes' => [
                'title',
                'content',
            ],
            'filterableAttributes' => [
                'categories',
            ],
            'relations' => [
                'images',
                'periods',
                'categories',
                'authors',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        Exhibit::class => [
            'indexUid' => 'exhibits',
            'searchableAttributes' => [
                'title',
                'content',
            ],
            'filterableAttributes' => [
                'categories',
            ],
            'relations' => [
                'images',
                'periods',
                'categories',
                'authors',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        Person::class => [
            'indexUid' => 'people',
            'searchableAttributes' => [
                'name',
            ],
            'filterableAttributes' => [
            ],
            'relations' => [
                'images',
                'periods',
                'cities',
                'artworks',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        Review::class => [
            'indexUid' => 'reviews',
            'searchableAttributes' => [
                'title',
                'content',
            ],
            'filterableAttributes' => [
                'categories',
            ],
            'relations' => [
                'images',
                'categories',
                'authors',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        HistoryArticle::class => [
            'indexUid' => 'history_articles',
            'searchableAttributes' => [
                'title',
                'content',
            ],
            'filterableAttributes' => [
                'categories',
            ],
            'relations' => [
                'images',
                'periods',
                'categories',
                'authors',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        Source::class => [
            'indexUid' => 'sources',
            'searchableAttributes' => [
                'title',
            ],
            'filterableAttributes' => [
            ],
            'relations' => [
                'file',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],

        Period::class => [
            'indexUid' => 'periods',
            'searchableAttributes' => [
                'name',
            ],
            'filterableAttributes' => [
            ],
            'relations' => [
                'images',
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],
    ],

];
