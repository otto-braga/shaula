<?php

namespace App\Policies;

use App\Models\Category;

class CategoryPolicy extends BasePolicy
{
    protected const CLASS_NAME = Category::class;
}
