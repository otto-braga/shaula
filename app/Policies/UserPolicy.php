<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    protected const CLASS_NAME = User::class;
}
