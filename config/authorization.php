<?php
// config/authorization.php
// -----------------------------------------------------------------------------
// This file defines the authorization configuration for roles and permissions in the application.

namespace App\Models;

// Helper constants for permission groups
// -----------------------------------------------------------------------------
const ALL = ['view', 'create', 'update','delete',];
const NO_DELETE = ['view','create','update',];

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
                Artwork::class => ALL,
                Person::class => ['view',],
            ],
        ],
        'Coordenador' => [
            'description' => 'Acesso total ao sistema, exceto configurações administrativas.',
            'permissions' => [
                Artwork::class => ALL,
            ],
        ],
        'Editor' => [
            'description' => 'Acesso limitado a funcionalidades básicas do sistema.',
            'permissions' => [
                Artwork::class => NO_DELETE,
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

