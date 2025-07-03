<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Mention;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MentionPublicController extends Controller
{
    public function showMentioned(Mention $mention)
    {
        $model = new $mention->mentioned_type;
        $route_name = 'public.' . $model->getTable() . '.show';

        return Redirect::route($route_name, $mention->mentioned);
    }

    public function showMentioner(Mention $mention)
    {
        $model = new $mention->mentioner_type;
        $route_name = 'public.' . $model->getTable() . '.show';

        return Redirect::route($route_name, $mention->mentioner);
    }

    public function redirectMention(Request $request)
    {
        $type = $request->type ?? null;
        $uuid = $request->key;

        $model = DB::table($type)->where('uuid', $uuid)->firstOrFail();

        if ($model) {
            return redirect()->route('public.' . $type . '.show', $model->slug);
        }

        // return redirect()->route('public.search.index', ['q' => $query]);
    }
}
