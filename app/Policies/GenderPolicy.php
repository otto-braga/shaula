<?php

namespace App\Policies;

use App\Models\Gender;

class GenderPolicy extends BasePolicy
{
    protected const CLASS_NAME = Gender::class;
}
