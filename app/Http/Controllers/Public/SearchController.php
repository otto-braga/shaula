<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request['search'];
        $results = [];

        if ($query) {
            //serch for name or term in content for review, history article and artwork
            $results['reviews'] = Review::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            $results['historyArticles'] = HistoryArticle::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            $results['artworks'] = Artwork::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();
        }

        return Inertia::render('search', [
            'query' => $query,
            'results' => $results,
        ]);
    }

    public function search(Request $request)
    {
        $key = $request->key;

        $results = [];

        foreach (config('searchable_types') as $searchable_type) {
            $model = $searchable_type['type'];
            $results[] = $model::search($key);
        }

        $retval = $results[0];

        foreach ($results as $key => $result) {
            if ($key == 0) {
                continue;
            }
            $retval = $retval->union($result);
        }

        $retval = $retval->orderBy('title')->simplePaginate(15);

        return response()->json($retval);
    }
}
