<?php

namespace App\Traits;

use App\Models\Mention;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;

trait HasMention
{
    public function getMentionsByType(Model $model)
    {
        $mentionsByType = [];

        foreach (config('mention_types') as $type) {
            $mentionsByType[] = [
                'type' => $type['type'],
                'type_label' => $type['label'],
                'mentions' => $model->mentioned()->where('mentioned_type', $type['type'])->get(),
            ];
        }

        return $mentionsByType;
    }

    public function getMentionsQueries()
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
                'type_label' => $type['label'],
                'query' => $query,
            ];
        }

        return $mentionTypes;
    }

    public function applyMentionsUpdate(Request $request, Model $model) {
        foreach ($request->mentions_by_type as $mentions_type) {
            if (count($mentions_type['mentions']) === 0) {
                continue;
            }

            $mentionType = $mentions_type['type'];
            $mentionedIds = Arr::pluck($mentions_type['mentions'], 'mentioned_id');


            $model->mentioned()->where('mentioned_type', $mentionType)
                ->whereNotIn('mentioned_id', $mentionedIds)
                ->delete();

            foreach ($mentionedIds as $mentionedId) {

                Mention::updateOrCreate([
                    'mentioned_id' => $mentionedId,
                    'mentioned_type' => $mentionType,
                    'mentioner_id' => $model->id,
                    'mentioner_type' => $model::class
                ]);
            }
        }
    }
}
