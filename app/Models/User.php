<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\Fetchable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use
        HasFactory,
        Notifiable,
        HasUuid;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The roles that belong to the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if the user has any of the specified roles.
     *
     * @param list<string> $roleNames
     * @return bool
     */
    public function hasAnyRole(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }

    /**
     * Check if the user has all of the specified roles.
     *
     * @param list<string> $roleNames
     * @return bool
     */
    public function hasAllRoles(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->count() === count($roleNames);
    }

    /**
     * Get the user's permissions.
     *
     * @return \Illuminate\Support\Collection
     */
    public function permissions()
    {
        $retval = [];

        foreach ($this->roles as $role) {
            $role_permissions = config('authorization.roles')[$role->name]['permissions'] ?? [];
            foreach ($role_permissions as $class => $permissions) {
                $class = class_basename($class);
                if (!isset($retval[$class])) {
                    $retval[$class] = [];
                }
                $retval[$class] = array_merge($retval[$class], $permissions);
            }
        }

        // Remove duplicates
        foreach ($retval as $class => $permissions) {
            $retval[$class] = array_unique($permissions);
        }

        return collect($retval);
    }
}
