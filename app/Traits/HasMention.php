<?php

namespace App\Traits;

use Illuminate\Support\Facades\Schema;

trait HasMention
{
    public function getMentionQueries()
    {
        $mentionTypes = [];

        foreach (config('mention_types') as $type) {
            $query = $type['type']::query();

            if (Schema::hasColumn($type['table'], 'name')) {
                $query->select('id', 'name as name');
            } elseif (Schema::hasColumn($type['table'], 'title')) {
                $query->select('id', 'title as name');
            }

            $query = $query->get()->toArray();

            $mentionTypes[] = [
                'type' => $type['type'],
                // 'type_label' => $type['label'],
                'query' => $query,
            ];
        }

        return $mentionTypes;
    }
}
