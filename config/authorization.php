<?php
// config/authorization.php
// -----------------------------------------------------------------------------
// This file defines the authorization configuration for roles and permissions in the application.

namespace App\Models;

// Helper constants for permission groups
// -----------------------------------------------------------------------------
const ALL = ['view', 'create', 'update','delete',];
const NO_DELETE = ['view','create','update',];
const VIEW = ['view',];
const NONE = [];

return [
    // =========================================================================
    // DEFINE ROLES AND PERMISSIONS HERE.
    // -------------------------------------------------------------------------
    // Each role has a name, description, and a set of permissions.
    // Permissions are defined as an array of actions that the role can perform on a model.
    // The keys in the 'permissions' array should match the class names of the models they apply to.
    // The values are arrays of actions that the role can perform on that model which are defined in the 'types' array.
    // Example: Artwork::class => ['view', 'create', 'update', 'delete'].
    'roles' => [
        'dev' => [
            'description' => 'Acesso total ao sistema.',
            'permissions' => [
                Role::class => ALL,
                User::class => ALL,

                Person::class => ALL,
                Artwork::class => ALL,
                Review::class => ALL,
                Period::class => ALL,
                HistoryArticle::class => ALL,
                Source::class => ALL,

                Gender::class => ALL,
                Activity::class => ALL,
                City::class => ALL,
                Language::class => ALL,
                Category::class => ALL,
                Award::class => ALL,
                SourceCategory::class => ALL,
            ],
        ],
        'Coordenador' => [
            'description' => 'Acesso total ao sistema, exceto edição de funções e remoção de usuários.',
            'permissions' => [
                Role::class => VIEW,
                User::class => NO_DELETE,

                Artwork::class => ALL,
                Person::class => ALL,
                Artwork::class => ALL,
                Review::class => ALL,
                Period::class => ALL,
                HistoryArticle::class => ALL,
                Source::class => ALL,

                Gender::class => ALL,
                Activity::class => ALL,
                City::class => ALL,
                Language::class => ALL,
                Category::class => ALL,
                Award::class => ALL,
                SourceCategory::class => ALL,
            ],
        ],
        'Editor' => [
            'description' => 'Acesso limitado ao sistema. Pode criar e editar cadastros, mas não pode excluir.',
            'permissions' => [
                Person::class => NO_DELETE,
                Artwork::class => NO_DELETE,
                Review::class => NO_DELETE,
                Period::class => NO_DELETE,
                HistoryArticle::class => NO_DELETE,
                Source::class => NO_DELETE,

                Gender::class => NO_DELETE,
                Activity::class => NO_DELETE,
                City::class => NO_DELETE,
                Language::class => NO_DELETE,
                Category::class => NO_DELETE,
                Award::class => NO_DELETE,
                SourceCategory::class => NO_DELETE,
            ],
        ],
    ],
    // =========================================================================

    // Define policy types and models which will use these policies.
    // -------------------------------------------------------------------------
    'types' => [
        'view',
        'create',
        'update',
        'delete',
    ],
    'models' => [
        Artwork::class,
        Person::class,
    ],
];

