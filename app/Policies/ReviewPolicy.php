<?php

namespace App\Policies;

use App\Models\Review;

class ReviewPolicy extends BasePolicy
{
    protected const CLASS_NAME = Review::class;
}
