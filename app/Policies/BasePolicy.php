<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

class BasePolicy
{
    // Constant to define the class. Subclasses should override this constant to specify their own class name.
    // This allows the policy to be generic and reusable for different models.
    // Example: In ArtworkPolicy, this constant would be set to Artwork::class.
    protected const CLASS_NAME = 'BasePolicy';

    function checkAuthorization(User $user, string $permission_type): Response
    {
        foreach ($user->roles as $user_role) {
            foreach (config('authorization.roles') as $role_name => $role_data) {
                if ($user_role->name === $role_name) {
                    if (in_array($permission_type, $role_data['permissions'][static::CLASS_NAME] ?? [])) {
                        return Response::allow();
                    }
                }
            }
        }

        return Response::deny();
    }

    public function view(User $user): Response
    {
        return $this->checkAuthorization($user, 'view');
    }

    // /**
    //  * Determine whether the user can view any models.
    //  */
    // public function viewAny(User $user): Response
    // {
    //     return $this->checkAuthorization($user, 'viewAny');
    // }

    // /**
    //  * Determine whether the user can view the model.
    //  */
    // public function view(User $user, Model $model): Response
    // {
    //     return $this->checkAuthorization($user, 'view');
    // }

    // /**
    //  * Determine whether the user can create models.
    //  */
    // public function create(User $user): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can update the model.
    //  */
    // public function update(User $user, Model $model): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can delete the model.
    //  */
    // public function delete(User $user, Model $model): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can restore the model.
    //  */
    // public function restore(User $user, Model $model): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can permanently delete the model.
    //  */
    // public function forceDelete(User $user, Model $model): bool
    // {
    //     return false;
    // }
}
