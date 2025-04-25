<?php

namespace App\Http\Controllers;

use App\Models\Mention;
use Illuminate\Http\Request;

class MentionController extends Controller
{
    protected function castMentioner($resource)
    {
        foreach (config('mention_types') as $mentionType) {
            if ($resource->mentioner_type === $mentionType['type']) {
                return new $mentionType['resource']($resource->mentioner);
            }
        }

        return null;
    }

    public function mentioner($id)
    {
        $mention = Mention::find($id);

        return Response()->json([
            'data' => $this->castMentioner($mention)
        ]);
    }

    protected function castMentioned($resource)
    {
        foreach (config('mention_types') as $mentionType) {
            if ($resource->mentioned_type === $mentionType['type']) {
                return new $mentionType['resource']($resource->mentioned);
            }
        }

        return null;
    }

    public function mentioned($id)
    {
        $mention = Mention::find($id);

        return response()->json([
            'data' => $this->castMentioned($mention)
        ]);
    }
}
