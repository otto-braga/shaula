<?php

use App\Models\Artwork;
use App\Models\Person;

return [
    'roles' => [
        'dev' => [
            'description' => 'Acesso total ao sistema.',
            'permissions' => [
                Artwork::class => [
                    'viewAny',
                    'view',
                    'create',
                    'update',
                    'delete',
                    'restore',
                    'forceDelete',
                ],
                Person::class => [
                    'viewAny',
                    'view',
                ],
            ],
        ],
        'Coordenador' => [
            'description' => 'Acesso total ao sistema, exceto configurações administrativas.',
            'permissions' => [
                Artwork::class => [
                    'viewAny',
                    'view',
                    'create',
                    'update',
                ],
            ],
        ],
        'Editor' => [
            'description' => 'Acesso limitado a funcionalidades básicas do sistema.',
            'permissions' => [
                Artwork::class => [
                    'viewAny',
                    'view',
                ],
            ],
        ],
    ],

    'types' => [
        'viewAny',
        'view',
        'create',
        'update',
        'delete',
        'restore',
        'forceDelete',
    ],
    'models' => [
        Artwork::class,
        Person::class,
    ],
];
