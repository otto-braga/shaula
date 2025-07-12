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
        if ($user->role === null) {
            return Response::deny('Não autorizado: usuário não possui nenhuma função atribuída.');
        }

        // dd(
        //     $user->role->name,
        //     static::CLASS_NAME,
        //     $permission_type,
        //     config('authorization.roles'),
        //     config('authorization.roles')[$user->role->name],
        //     config('authorization.roles')[$user->role->name]['permissions'][static::CLASS_NAME],
        //     in_array($permission_type, config('authorization.roles')[$user->role->name]['permissions'][static::CLASS_NAME])
        // );

        if (array_key_exists($user->role->name, config('authorization.roles'))) {
            $role_data = config('authorization.roles')[$user->role->name];
            if (in_array($permission_type, $role_data['permissions'][static::CLASS_NAME] ?? [])) {
                return Response::allow();
            }
        }

        return Response::deny();
    }

    public function dev(User $user): Response
    {
        return $this->checkAuthorization($user, 'dev');
    }

    public function view(User $user): Response
    {
        return $this->checkAuthorization($user, 'view');
    }

    public function create(User $user): Response
    {
        return $this->checkAuthorization($user, 'create');
    }

    public function update(User $user): Response
    {
        return $this->checkAuthorization($user, 'update');
    }

    public function delete(User $user): Response
    {
        return $this->checkAuthorization($user, 'delete');
    }
}
