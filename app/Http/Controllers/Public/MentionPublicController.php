<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Mention;
use Illuminate\Support\Facades\Redirect;

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
}
