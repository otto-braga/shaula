<?php

namespace App\Policies;

use App\Models\Activity;

class ActivityPolicy extends BasePolicy
{
    protected const CLASS_NAME = Activity::class;
}
