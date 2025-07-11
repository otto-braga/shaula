<?php

namespace App\Policies;

use App\Models\Artwork;

class ArtworkPolicy extends BasePolicy
{
    protected const CLASS_NAME = Artwork::class;
}
