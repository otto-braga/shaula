<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Trait ParsesUuids
 *
 * This trait provides methods to sync UUIDs with a relation, given a model class.
 * It can also parse an array of UUIDs to return their corresponding IDs.
 */
trait ParsesUuids
{
    /**
     * Syncs the given array with UUIDs with the specified relation, given a model class.
     * If a callback is provided, it will be called with the IDs to sync.
     *
     * @param array $uuids
     * @param string $class
     * @param Relation $relation
     * @param callable|null $callback
     */
    protected function syncUuids(array $uuids, Relation $relation, ?callable $callback = null): void
    {
        $ids = [];

        foreach ($uuids as $uuid) {
            $model = $relation->getRelated()::class::where('uuid', $uuid)->first();
            if ($model) {
                $ids[] = $model->id;
            }
        }

        if ($callback) {
            $callback($ids, $relation);
        }
        else {
            $relation->sync($ids);
        }
    }

    /**
     * Parses an array of UUIDs and returns their corresponding IDs, given a model class.
     *
     * @param string $class
     * @param array $uuids
     * @return array
     */
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
