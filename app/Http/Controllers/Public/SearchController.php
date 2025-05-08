<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;
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
        $results['artworks'] = Artwork::search($key);
        $results['reviews'] = Review::search($key);
        $results['people'] = Person::search($key);

        $test = $results['artworks']
            ->union($results['reviews'])
            ->union($results['people']) // Não pode ser a primeira da lista, pois possui coluna name ao invés de title.
            ->orderBy('title')
            ->simplePaginate(15);

        return response()->json($test);
    }
}
