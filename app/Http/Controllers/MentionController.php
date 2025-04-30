<?php

namespace App\Http\Controllers;

use App\Models\Mention;
use Illuminate\Support\Facades\Redirect;

class MentionController extends Controller
{
    protected function castMentioner($instance)
    {
        foreach (config('mention_types') as $mentionType) {
            if ($instance->mentioner_type === $mentionType['type']) {
                return new $mentionType['resource']($instance->mentioner);
            }
        }

        return null;
    }

    public function getMentioner(Mention $mention)
    {
        return response()->json([
            'data' => $this->castMentioner($mention)
        ]);
    }

    protected function castMentioned($instance)
    {
        foreach (config('mention_types') as $mentionType) {
            if ($instance->mentioned_type === $mentionType['type']) {
                return new $mentionType['resource']($instance->mentioned);
            }
        }

        return null;
    }

    public function getMentioned(Mention $mention)
    {
        return response()->json([
            'data' => $this->castMentioned($mention)
        ]);
    }

    public function show(Mention $mention)
    {
        $model = new $mention->mentioned_type;
        $route_name = 'public.' . $model->getTable() . '.show';

        return Redirect::route($route_name, $mention->mentioned);
    }
}
