<?php

namespace App\Models;

return [
    'index' => [

        Artwork::class => [
            'indexUid' => 'artworks',
            'searchableAttributes' => [
                'title',
                // 'authors',
                // 'periods',
            ],
            'filterableAttributes' => [
                'periods',
                'categories'
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
                // 'artworks',
                // 'periods',
            ],
            'filterableAttributes' => [
                'periods',
                'cities',
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
                // 'artworks',
                // 'periods',
            ],
            'filterableAttributes' => [
                'periods',
                'cities',
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
                // 'authors',
                // 'artworks',
            ],
            'filterableAttributes' => [
                'categories',
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
                // 'authors',
                // 'periods',
            ],
            'filterableAttributes' => [
                'periods',
                'categories',
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
                'content',
            ],
            'filterableAttributes' => [
                'source_categories',
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
                'content',
            ],
            'filterableAttributes' => [
            ],
            'sortableAttributes' => [
                'created_at',
                'updated_at',
            ],
        ],
    ],

];
