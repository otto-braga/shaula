<?php

namespace App\Models;

use App\Traits\Fetchable;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class Role extends Model
{
    use
        HasFactory,
        HasUuid,
        HasSlug,
        Fetchable;

    protected $table = 'roles';

    protected $fillable = [
        'name',
        'label',
        'description',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user', 'role_id', 'user_id');
    }

    public function permissions(): Collection
    {
        $retval = [];

        $role_permissions = config('authorization.roles')[$this->name]['permissions'] ?? [];
        foreach ($role_permissions as $class => $permissions) {
            $class = class_basename($class);
            if (!isset($retval[$class])) {
                $retval[$class] = [];
            }
            $retval[$class] = array_merge($retval[$class], $permissions);
        }

        // Remove duplicates
        foreach ($retval as $class => $permissions) {
            $retval[$class] = array_unique($permissions);
        }

        return collect($retval);
    }
}
