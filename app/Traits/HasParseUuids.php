<?php

namespace App\Traits;

use App\Models\Person;

trait HasParseUuids
{
    protected function parseUuids($class, $uuids)
    {
        $ids = [];

        foreach ($uuids as $uuid) {
            $model = $class::where('uuid', $uuid)->first();
            if ($model) {
                $ids[] = $model->id;
            }
        }

        return $ids;
    }
}
