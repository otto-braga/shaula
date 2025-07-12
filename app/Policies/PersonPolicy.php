<?php

namespace App\Policies;

use App\Models\Person;

class PersonPolicy extends BasePolicy
{
    protected const CLASS_NAME = Person::class;
}
